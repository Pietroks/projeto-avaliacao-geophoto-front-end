<template>
  <section class="background1">
    <div class="container">
      <div v-if="showConfirmationModal" class="modal-overlay">
        <div class="modal-content">
          <h4>Confirmar Envio de Notas?</h4>
          <p>Você está prestes a enviar as notas para esta imagem. Esta ação não pode ser desfeita.</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="cancelarEnvio">Cancelar</button>
            <button class="btn btn-primary" @click="executarEnvio">Confirmar</button>
          </div>
        </div>
      </div>

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
                  <div class="card-body d-flex flex-column">
                    <p class="card-text">{{ image.description }}</p>
                    
                    <div v-if="isAvaliador" class="mt-auto">
                      <div v-for="criterio in criterios" :key="criterio.id" class="mb-2">
                        <label :for="`nota-${image.image_id}-${criterio.id}`" class="form-label">
                          {{ criterio.nome }}:
                        </label>
                        <input
                          :id="`nota-${image.image_id}-${criterio.id}`"
                          v-model.number="image.notas[criterio.id]"
                          type="number"
                          class="form-control"
                          min="1"
                          max="10"
                          step="1"
                          placeholder="1-10"
                        />
                      </div>
                      <button class="btn btn-primary w-100 mt-2" @click="confirmarEnvio(image)">
                        Avaliar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p v-else class="text-center">Não há imagens na Categoria A.</p>
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
        showConfirmationModal: false,
        photoToSubmit: null,
        criterios: [
          { id: 'criatividade', nome: 'Criatividade' },
          { id: 'composicao', nome: 'Composição' },
          { id: 'tecnica', nome: 'Qualidade Técnica' },
          { id: 'impacto', nome: 'Impacto Visual' },
          { id: 'tema', nome: 'Adequação ao Tema' },
        ],
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
          this.usuario = await response.json();
          const images = await this.carregarImagensComDetalhes(this.usuario.id);
          this.imagensA = images.filter((img) => img.subcategory === "A");
          this.imagensB = images.filter((img) => img.subcategory === "B");
        } else {
          alert("Erro ao carregar os dados do usuário.");
        }
      } catch (error) {
        alert("Erro na comunicação com o servidor. Verifique sua conexão.");
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
                    const notas = {};
                    this.criterios.forEach(c => { notas[c.id] = null; });
                    return {
                        ...image,
                        image_url: `${API_URL}/images/${image.image_id}/`,
                        notas,
                    };
                });
            } catch (error) {
                console.error("Erro ao carregar imagens:", error);
                return [];
            }
        },

        confirmarEnvio(image) {
            const todasAsNotasPreenchidas = this.criterios.every(
                c => typeof image.notas[c.id] === 'number' && image.notas[c.id] >= 1 && image.notas[c.id] <= 10
            );
            if (!todasAsNotasPreenchidas) {
                alert("Por favor, preencha todas as 5 notas com valores entre 1 e 10.");
                return;
            }
            this.photoToSubmit = image;
            this.showConfirmationModal = true;
        },

        cancelarEnvio() {
            this.showConfirmationModal = false;
            this.photoToSubmit = null;
        },

        async executarEnvioNotasA() {
            if (!this.photoToSubmit) return;
            const image = this.photoToSubmit;

            const ratingsPayload = this.criterios.map(criterio => ({
                criterion_name: criterio.nome,
                rating: image.notas[criterio.id]
            }));

            const body = {
                image_id: image.image_id,
                user_id: this.user.id,
                ratings: ratingsPayload,
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
                if (!response.ok) throw new Error('Erro no servidor ao enviar notas.');
                alert("Notas enviadas com sucesso!");
            } catch (error) {
                alert(error.message);
            } finally {
                this.cancelarEnvio();
            }
        },

        async enviarNotaCategoriaB() {
            if (this.notaCategoriaB === null || this.notaCategoriaB < 1 || this.notaCategoriaB > 10) {
                alert("Por favor, insira uma nota válida para a Categoria B (entre 1 e 10).");
                return;
            }

            const promises = this.imagensB.map(image => {
                const body = {
                    rating: this.notaCategoriaB,
                    user_id: this.user.id,
                    image_id: image.image_id,
                };
                const endpoint = `${API_URL}/images/${image.image_id}/rate/`;
                return fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.token}` },
                    body: JSON.stringify(body),
                });
            });

            try {
                const responses = await Promise.all(promises);
                if (responses.some(res => !res.ok)) throw new Error('Falha ao enviar uma ou mais notas.');
                alert("Notas da Categoria B enviadas com sucesso!");
            } catch (error) {
                alert(error.message);
            }
        },
    },
};
</script>

<style scoped>
.background-votacao {
  background-color: #f0f2f5;
  min-height: 100vh;
}
.tituloConcurso h2 {
  font-weight: 300;
  color: #333;
}
.categoria-container {
  margin-top: 2rem;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.fotosImg {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
}
.card-votacao {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-votacao:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}
.description-text {
  flex-grow: 1; 
  font-size: 0.9rem;
  color: #555;
}
.criterio-input-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.criterio-input-group .form-label {
    margin-bottom: 0;
    font-size: 0.85rem;
}
.criterio-input-group .form-control {
    max-width: 80px;
}

/* Estilos do Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  max-width: 400px;
  width: 90%;
}
.modal-content h4 {
  margin-bottom: 1rem;
}
.modal-content p {
  color: #6c757d;
  margin-bottom: 1.5rem;
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
</style>
