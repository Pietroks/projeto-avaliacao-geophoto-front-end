<template>
  <section class="background1">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="tituloConcurso text-center mb-4">
            <h2>Imagens de {{ usuario.name }}</h2>
          </div>

          <div class="categoria">
            <h3 class="text-center mb-3">Categoria A</h3>
            <div v-if="imagensA.length > 0" class="row g-4">
              <div v-for="image in imagensA" :key="image.image_id" class="col-12 col-md-6 col-lg-4">
                <div class="card h-100">
                  <img :src="image.image_url" class="card-img-top fotosImg" alt="Imagem do usuário" />
                  <div class="card-body">
                    <p class="card-text">{{ image.description }}</p>
                    
                    <div v-if="isAvaliador">
                      <div v-for="criterio in criterios" :key="criterio.id" class="mb-2">
                        <label :for="`nota-${image.image_id}-${criterio.id}`" class="form-label">
                          {{ criterio.nome }}:
                        </label>
                        <input
                          :id="`nota-${image.image_id}-${criterio.id}`"
                          v-model.number="image.notas[criterio.id]"
                          type="number"
                          class="form-control"
                          min="0"
                          max="10"
                          step="0.5"
                          placeholder="0-10"
                        />
                      </div>
                      <button class="btn btn-primary w-100 mt-2" @click="enviarNota(image, 'A')">
                        Enviar Notas
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p v-else class="text-center">Não há imagens na Categoria A.</p>
          </div>

          <div class="categoria mt-5">
            <h3 class="text-center mb-3">Categoria B</h3>
            <div v-if="imagensB.length > 0" class="row g-4">
              <div v-for="image in imagensB" :key="image.image_id" class="col-12 col-md-6 col-lg-3">
                <img :src="image.image_url" class="fotosImg" alt="Imagem do usuário" />
                <p>{{ image.description }}</p>
              </div>
            </div>
            <div v-if="categoriaBMedia !== null" class="mt-4 text-center">
              <p><strong>Nota da Categoria B:</strong> {{ categoriaBMedia }}</p>
            </div>

            <div v-if="imagensB.length > 0" class="mt-4 text-center">
              <label for="notaB" v-if="isAvaliador">Nota para o conjunto:</label>
              <input
                v-if="isAvaliador"
                v-model.number="notaCategoriaB"
                type="number"
                id="notaB"
                min="0"
                max="10"
                placeholder="Dê sua nota"
              />
              <button v-if="isAvaliador" @click="enviarNotaCategoriaB">Enviar Nota para Categoria B</button>
              <p v-else>Você não tem permissão para avaliar.</p>
            </div>
            <p v-else class="text-center">Não há imagens na Categoria B.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
  
  <script>
  import { API_URL } from "@/config/config.js";
  
  export default {
    name: "VotacaoPage",
    data() {
        return {
          usuario: {},
          imagensA: [],
          imagensB: [],
          notaCategoriaB: null,
          categoriaBMedia: null,
          categoriaAMedia: null,
          // Critérios de avaliação para a Categoria A
          criterios: [
            { id: 'criatividade', nome: 'Criatividade' },
            { id: 'composicao', nome: 'Composição' },
            { id: 'tecnica', nome: 'Qualidade Técnica' },
            { id: 'impacto', nome: 'Impacto Visual' },
            { id: 'tema', nome: 'Adequação ao Tema' },
          ]
        };
      },
     computed: {
        isAvaliador() {
          return this.$store.getters['user/isAvaliador'];
        },
        token() {
          return this.$store.getters['user/token'];
        },
        user() {
            return this.$store.getters['user/user'];
        }
      },
    async created() {
        const usuarioId = this.$route.params.id;
        try {
          const response = await fetch(`${API_URL}/users/${usuarioId}`, {
            headers: { Authorization: `Bearer ${this.token}` },
          });
          if (response.ok) {
            const usuario = await response.json();
            this.usuario = usuario;
            
            const images = await this.carregarImagensComDetalhes(usuario.id);
            this.imagensA = images.filter((img) => img.subcategory === "A");
            this.imagensB = images.filter((img) => img.subcategory === "B");
            
            // Carregar as médias das notas
            await this.carregarMediaCategoria("A", usuarioId);
            await this.carregarMediaCategoria("B", usuarioId);
          } else {
            alert("Erro ao carregar o usuário.");
          }
        } catch (error) {
          alert("Erro ao carregar o usuário. Verifique sua conexão.");
        }
      },
    methods: {
      async carregarImagensComDetalhes(usuarioId) {
          try {
            const response = await fetch(`${API_URL}/user/images/${usuarioId}`, {
              headers: { Authorization: `Bearer ${this.token}` },
            });
            if (!response.ok) return [];
    
            const { images } = await response.json();
            return images.map(image => {
              // Inicializa o objeto de notas para cada critério
              const notas = {};
              this.criterios.forEach(c => {
                notas[c.id] = null;
              });
              return {
                ...image,
                image_url: `${API_URL}/images/${image.image_id}/`,
                notas: notas,
              };
            });
          } catch (error) {
            console.error("Erro ao carregar imagens:", error);
            return [];
          }
        },
        
      async carregarMediaCategoria(subcategory, usuarioId) {
        try {
          const response = await fetch(`${API_URL}/images/rate/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: usuarioId, 
              subcategory: subcategory, 
            }),
          });
  
          if (response.ok) {
            const { rating } = await response.json();
            if (subcategory === "A") {
              this.categoriaAMedia = rating.toFixed(2); // Média para a Categoria A
            } else if (subcategory === "B") {
              this.categoriaBMedia = rating.toFixed(2); // Média para a Categoria B
            }
          } else {
            console.error("Erro ao carregar média da categoria:", response.statusText);
          }
        } catch (error) {
          console.error("Erro ao carregar média da categoria:", error);
        }
      },
      async enviarNota(image, categoria) {
          if (categoria === 'A') {
            // Validação: Verifica se todas as 5 notas foram preenchidas
            const todasAsNotasPreenchidas = this.criterios.every(c => image.notas[c.id] !== null && image.notas[c.id] >= 0 && image.notas[c.id] <= 10);
            if (!todasAsNotasPreenchidas) {
              alert("Por favor, preencha todas as 5 notas para a imagem com valores entre 0 e 10.");
              return;
            }
    
            // Calcula a média das 5 notas
            const soma = this.criterios.reduce((acc, c) => acc + image.notas[c.id], 0);
            const media = soma / this.criterios.length;
    
            const body = {
              image_id: image.image_id,
              user_id: this.user.id,
              rating: media.toFixed(2), // Enviando a média
              criteria_ratings: image.notas, // Enviando as notas individuais
            };
    
            try {
              const endpoint = `${API_URL}/images/${image.image_id}/rate/`;
              const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${this.token}`,
                },
                body: JSON.stringify(body),
              });
              if (!response.ok) throw new Error('Erro ao enviar a nota.');
              
              alert("Notas enviadas com sucesso!");
              await this.carregarMediaCategoria("A", this.usuario.id);
    
            } catch (error) {
              alert(error.message);
            }
          }
        },
      // Método para enviar nota para todas as imagens da Categoria B
      async enviarNotaCategoriaB() {
        if (this.notaCategoriaB === null || this.notaCategoriaB < 0 || this.notaCategoriaB > 10) {
          alert("Por favor, insira uma nota válida para a Categoria B.");
          return;
        }
        
        // Itera sobre as imagens da Categoria B e envia a mesma nota para cada uma
        for (let image of this.imagensB) {
          await this.enviarNota(image, "B");  // Envia a mesma nota para cada imagem da categoria B
        }
      },
    },
  };
</script>

  
  <style scoped> 
  button { 
    margin-top: 10px; 
  } 
  input { 
    margin-right: 10px; 
    margin-top: 10px; 
  } 
  .categoria {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}
.tituloConcurso {
  margin-bottom: 3rem;
  font-size: 3rem;
  font-weight: 300;
}
.fotosImg {
  width: 100%;
  height: 250px;
  object-fit: cover;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}
.card {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
  </style>
  
