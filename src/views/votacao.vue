<template>
    <section class="background1">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="tituloConcurso text-center mb-4">
              <h2>Imagens de {{ usuario.name }}</h2>
            </div>
  
            <!-- Categoria A -->
            <div class="categoria">
              <h3 class="text-center mb-3">Categoria A</h3>
              <div v-if="imagensA.length > 0" class="row g-4">
                <div v-for="image in imagensA" :key="image.image_id" class="col-12 col-md-6 col-lg-3">
                  <img :src="image.image_url" class="fotosImg" alt="Imagem do usuário" />
                  <p>{{ image.description }}</p>
                  <label v-if="isAvaliador" for="nota">Nota:</label>
                    <input
                    v-if="isAvaliador"
                    v-model="image.nota"
                    type="number"
                    id="nota"
                    min="0"
                    max="10"
                    placeholder="Dê sua nota"
                    />
                  <button v-if="isAvaliador" @click="enviarNota(image, 'A')">Enviar Nota</button>
                </div>
              </div>
              <p v-else>Não há imagens na Categoria A.</p>
            </div>
  
            <!-- Categoria B -->
            <div class="categoria">
              <h3 class="text-center mb-3">Categoria B</h3>
              <div v-if="imagensB.length > 0" class="row g-4">
                <div v-for="image in imagensB" :key="image.image_id" class="col-12 col-md-6 col-lg-3">
                  <img :src="image.image_url" class="fotosImg" alt="Imagem do usuário" />
                  <p>{{ image.description }}</p>
                </div>
              </div>
  
              <!-- Exibição da média das notas da Categoria B -->
              <div v-if="categoriaBMedia !== null" class="mt-4">
                <p><strong>Nota da Categoria B:</strong> {{ categoriaBMedia }}</p>
              </div>
  
              <div v-if="imagensB.length > 0" class="mt-4">
                <label for="notaB" v-if="isAvaliador">Nota para o conjunto:</label>
                <input
                  v-if="isAvaliador"
                  v-model="notaCategoriaB"
                  type="number"
                  id="notaB"
                  min="0"
                  max="10"
                  placeholder="Dê sua nota"
                />
                <button v-if="isAvaliador" @click="enviarNotaCategoriaB">Enviar Nota para Categoria B</button>
                <p v-else>Você não tem permissão para avaliar.</p>
              </div>
              <p v-else>Não há imagens na Categoria B.</p>
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
        notaCategoriaB: null, // Nota do conjunto da Categoria B
        categoriaBMedia: null, // Média das notas da Categoria B
        categoriaAMedia: null, // Média das notas da Categoria A
      };
    },
    computed: {
      isAvaliador() {
        return this.$store.getters['user/isAvaliador'];  // Verificar se o usuário é avaliador
      },
      token() {
        return this.$store.getters['user/token'];  // Obter o token do Vuex
      }
    },
    async created() {
      const usuarioId = this.$route.params.id;
      try {
        const response = await fetch(`${API_URL}/users/${usuarioId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
        });
        if (response.ok) {
          const usuario = await response.json();
          usuario.images = await this.carregarImagensComDetalhes(usuario.id);
          this.usuario = usuario;
  
          console.log(usuario.images);
          this.imagensA = usuario.images.filter((img) => img.subcategory === "A");
          this.imagensB = usuario.images.filter((img) => img.subcategory === "B");
          console.log('this.imagensA');
          console.log(this.imagensA);
          // Carregar as médias das notas para as duas categorias
          await this.carregarMediaCategoria("A", usuarioId);
          await this.carregarMediaCategoria("B", usuarioId);
        } else {
          console.error("Erro ao carregar usuário:", response.statusText);
          alert("Erro ao carregar o usuário.");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao carregar o usuário. Verifique sua conexão.");
      }
    },
    methods: {
      async carregarImagensComDetalhes(usuarioId) {
        try {
          const response = await fetch(`${API_URL}/user/images/${usuarioId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          });
          if (response.ok) {
            const { images } = await response.json();
            const imagesWithDetails = await Promise.all(
              images.map(async (image) => {
                const imageDetails = await this.carregarDetalhesDaImagem(image.image_id);
                return {
                  image_id: image.image_id,
                  image_url: `${API_URL}/images/${image.image_id}/`,
                  subcategory: imageDetails.subcategory,
                  description: imageDetails?.description || "Sem descrição",
                  nota: null,
                };
              })
            );
            return imagesWithDetails;
          } else {
            console.error("Erro ao carregar imagens:", response.statusText);
            return [];
          }
        } catch (error) {
          console.error("Erro ao carregar imagens:", error);
          return [];
        }
      },
      async carregarDetalhesDaImagem(imageId) {
        console.log(imageId);
        try {
            const response = await fetch(`${API_URL}/images/${imageId}/details`, {
            method: "GET",
          });
          if (response.ok) {
            return await response.json();
          } else {
            console.error("Erro ao carregar detalhes da imagem:", response.statusText);
            return null;
          }
        } catch (error) {
          console.error("Erro ao carregar detalhes da imagem:", error);
          return null;
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
        try {
            const user_id = this.usuario.id; // O user_id do usuário logado
            let endpoint;
            let body;

            if (categoria === "A") {
            console.log("aqui")
            // Para a categoria A, apenas enviar a nota da imagem específica
            endpoint = `${API_URL}/images/${image.image_id}/rate/`;
            body = {
                image_id:image.image_id,
                rating: image.nota,
                user_id: user_id, // Enviando o user_id junto com o rating
            };
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`,
                },
                body: JSON.stringify(body),
                });
                if (!response.ok) {
                console.error("Erro ao enviar nota para imagem da categoria B:", response.statusText);
                alert("Erro ao enviar nota para categoria B.");
                return;
                }
            } else if (categoria === "B") {
            // Para a categoria B, enviar a mesma nota para todas as imagens, uma por uma
            for (let imagem of this.imagensB) {
                endpoint = `${API_URL}/images/${imagem.image_id}/rate/`;
                body = {
                rating: this.notaCategoriaB,  // Nota para cada imagem da categoria B
                user_id: user_id,  // Enviar o user_id
                };

                // Envia a requisição para cada imagem da categoria B
                const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`,
                },
                body: JSON.stringify(body),
                });

                if (!response.ok) {
                console.error("Erro ao enviar nota para imagem da categoria B:", response.statusText);
                alert("Erro ao enviar nota para categoria B.");
                return;
                }
            }
            }

            // Se a nota for enviada com sucesso, exibe um alerta
            alert("Nota enviada com sucesso!");
            // Recarregar as médias após enviar as notas
            await this.carregarMediaCategoria("A", this.usuario.id);
            await this.carregarMediaCategoria("B", this.usuario.id);

        } catch (error) {
            console.error("Erro ao enviar nota:", error);
            alert("Erro ao enviar nota. Verifique sua conexão.");
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
  .tituloConcurso { margin-bottom: 3rem; font-size: 3rem; font-weight: 300; } 
  .fotosImg { width: 150px; height: 150px; object-fit: cover; border-radius: 8px; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); } 
  button { margin-top: 10px; } 
  input { margin-right: 10px; margin-top: 10px; } 
  </style>
  