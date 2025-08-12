<template>
  <section class="background-votacao py-5">
    <div class="container">
      <div v-if="showConfirmationModal" class="modal-overlay">
        <div class="modal-content">
          <h4>Confirmar Envio de Notas?</h4>
          <p>Você está prestes a enviar as notas para esta imagem/conjunto. Esta ação não pode ser desfeita.</p>
          <div class="modal-actions">
            <button class="btn btn-outline-secondary" @click="cancelarEnvio">Cancelar</button>
            <button class="btn btn-primary" @click="executarEnvioNotas">Confirmar</button>
          </div>
        </div>
      </div>

      <div v-if="showImageModal" class="image-modal-overlay" @click.self="closeImageModal">
        <div class="image-modal-content">
          <button class="image-modal-close-btn" @click="closeImageModal">&times;</button>

          <div v-if="modalImages.length === 1">
            <img :src="modalImages[0].image_url" class="carousel-image" alt="Imagem em tamanho real" />
          </div>

          <div v-if="modalImages.length > 1" class="carousel-container">
            <img
              :src="modalImages[currentCarouselIndex].image_url"
              class="carousel-image"
              :key="modalImages[currentCarouselIndex].image_id"
              alt="Imagem do carrossel"
            />
            <button class="carousel-nav prev" @click="prevImage">&#10094;</button>
            <button class="carousel-nav next" @click="nextImage">&#10095;</button>
            <div class="carousel-counter">{{ currentCarouselIndex + 1 }} / {{ modalImages.length }}</div>
          </div>
        </div>
      </div>

      <div v-if="usuario.name" class="text-center mb-5">
        <h2 class="titulo-pagina">
          Avaliando fotos de: <strong>{{ usuario.name }}</strong>
        </h2>
        <p class="text-muted">Categoria de Formação: {{ usuario.category }}</p>
        <button v-if="isAvaliador" @click="baixarComprovante" class="btn btn-info mt-2">
          <ArrowDownTrayIcon class="icon-btn" />
          Baixar Comprovante de Matrícula
        </button>
      </div>

      <div class="categoria-container mb-5">
        <h3 class="titulo-categoria">Categoria A</h3>
        <div v-if="imagensA.length > 0" class="row g-4 justify-content-center">
          <div v-for="image in imagensA" :key="image.image_id" class="col-12 col-md-10 col-lg-8">
            <div class="card card-votacao h-100">
              <img
                :src="image.image_url || defaultImage"
                class="card-img-top fotosImg"
                alt="Imagem do usuário"
                @click="openImageModal([image])"
              />
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ image.nome || "Foto sem nome" }}</h5>
                <h6 v-if="image.local" class="card-subtitle mb-2 text-muted">{{ image.local }}</h6>
                <p v-if="image.equipamento" class="card-text small"><strong>Equipamento:</strong> {{ image.equipamento }}</p>
                <p class="card-text description-text mt-2">
                  {{ image.description }}
                </p>

                <div v-if="isAvaliador" class="mt-auto pt-3">
                  <div v-for="criterio in criterios" :key="criterio.id" class="criterio-input-group mb-2">
                    <label :for="`nota-${image.image_id}-${criterio.id}`" class="form-label"> {{ criterio.nome }}: </label>
                    <input
                      :disabled="image.avaliada"
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
                  <button :disabled="image.avaliada" class="btn btn-primary w-100 mt-2" @click="confirmarEnvio(image, 'A')">
                    {{ image.avaliada ? "Já Avaliada" : "Avaliar Foto" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-center text-muted">Não há imagens na Categoria A.</p>
      </div>

      <div class="categoria-container">
        <h3 class="titulo-categoria">Categoria B</h3>
        <div v-if="imagensB.length > 0">
          <div class="card card-body bg-light mb-4 text-dark info-conjunto">
            <h5><strong>Nome do Conjunto:</strong> {{ imagensB[0].nome || "Não informado" }}</h5>
            <p class="mb-1"><strong>Local:</strong> {{ imagensB[0].local || "Não informado" }}</p>
            <p class="mb-0"><strong>Equipamento:</strong> {{ imagensB[0].equipamento || "Não informado" }}</p>
            <p class="mt-2 mb-0"><strong>Descrição do Conjunto:</strong> {{ imagensB[0].description }}</p>
          </div>

          <div class="row g-4">
            <div v-for="(image, index) in imagensB" :key="image.image_id" class="col-12 col-md-6 col-lg-4">
              <div class="card card-votacao h-100">
                <img
                  :src="image.image_url || defaultImage"
                  class="card-img-top fotosImg"
                  alt="Imagem do usuário"
                  @click="openImageModal(imagensB, index)"
                />
              </div>
            </div>
          </div>

          <div v-if="isAvaliador" class="col-12 mt-4">
            <div class="card p-4">
              <h5 class="text-center mb-3">Avaliação do Conjunto Categoria B</h5>
              <div v-for="criterio in criterios" :key="criterio.id" class="criterio-input-group mb-3">
                <label :for="`nota-categoriaB-${criterio.id}`" class="form-label"> {{ criterio.nome }}: </label>
                <input
                  :disabled="categoriaBJaAvaliada"
                  :id="`nota-categoriaB-${criterio.id}`"
                  v-model.number="notasCategoriaB[criterio.id]"
                  type="number"
                  class="form-control"
                  min="1"
                  max="10"
                  step="1"
                  placeholder="1-10"
                />
              </div>
              <button class="btn btn-primary w-100" @click="confirmarEnvio(null, 'B')" :disabled="categoriaBJaAvaliada">
                {{ categoriaBJaAvaliada ? "Conjunto Avaliado" : "Avaliar Categoria B" }}
              </button>
            </div>
          </div>
        </div>
        <p v-else class="text-center text-muted">Não há imagens na Categoria B.</p>
      </div>
    </div>
  </section>
</template>

<script>
import { API_URL } from "@/config/config.js";
import defaultImage from "@/assets/default.svg";
import { ArrowDownTrayIcon } from "@heroicons/vue/24/solid";

export default {
  name: "VotacaoPage",
  components: { ArrowDownTrayIcon },
  data() {
    return {
      usuario: {},
      imagensA: [],
      imagensB: [],
      notaCategoriaB: null,
      showConfirmationModal: false,
      photoToSubmit: null,
      itemParaAvaliar: null,
      defaultImage,
      criterios: [
        { id: "criatividade", nome: "Criatividade" },
        { id: "composicao", nome: "Composição" },
        { id: "tecnica", nome: "Qualidade Técnica" },
        { id: "impacto", nome: "Impacto Visual" },
        { id: "tema", nome: "Adequação ao Tema" },
      ],
      notasCategoriaB: {},
      categoriaBJaAvaliada: false,
      showImageModal: false,
      modalImages: [],
      currentCarouselIndex: 0,
    };
  },
  computed: {
    isAvaliador() {
      return this.$store.getters["user/isAvaliador"];
    },
    token() {
      return this.$store.getters["user/token"];
    },
    user() {
      return this.$store.getters["user/user"];
    },
  },
  async created() {
    const usuarioId = this.$route.params.id;
    try {
      const response = await fetch(`${API_URL}/users/${usuarioId}/`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (response.ok) {
        this.usuario = await response.json();
        const images = await this.carregarImagensComDetalhes(this.usuario.id);
        this.imagensA = images.filter((img) => img.subcategory === "A");
        this.imagensB = images.filter((img) => img.subcategory === "B");
        await this.carregarNotasCategoria("A");
        await this.carregarNotasCategoria("B");
      } else {
        alert("Erro ao carregar os dados do usuário faça login novamente");
        this.logout();
      }
    } catch (error) {
      alert("Erro na comunicação com o servidor. Verifique sua conexão.");
    }
  },
  methods: {
    openImageModal(images, startIndex = 0) {
      this.modalImages = images;
      this.currentCarouselIndex = startIndex;
      this.showImageModal = true;
    },
    closeImageModal() {
      this.showImageModal = false;
      this.modalImages = [];
      this.currentCarouselIndex = 0;
    },
    nextImage() {
      this.currentCarouselIndex = (this.currentCarouselIndex + 1) % this.modalImages.length;
    },
    prevImage() {
      this.currentCarouselIndex = (this.currentCarouselIndex - 1 + this.modalImages.length) % this.modalImages.length;
    },

    logout() {
      this.$store.dispatch("user/logout");
      this.$router.push("/login");
    },
    async carregarImagensComDetalhes(usuarioId) {
      try {
        const response = await fetch(`${API_URL}/user/images/${usuarioId}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        if (!response.ok) return [];

        const { images } = await response.json();

        const imagensComDetalhes = await Promise.all(
          images.map(async (image) => {
            // Inicializa o objeto de notas para cada critério
            const notas = {};
            this.criterios.forEach((c) => {
              notas[c.id] = null;
            });

            // Faz a requisição para os detalhes da imagem
            const detalhesResponse = await fetch(`${API_URL}/images/${image.image_id}/details`, {
              headers: { Authorization: `Bearer ${this.token}` },
            });

            let detalhes = {};
            if (detalhesResponse.ok) {
              detalhes = await detalhesResponse.json();
            }

            return {
              ...image,
              ...detalhes,
              image_url: `${API_URL}/images/${image.image_id}/`,
              notas,
            };
          })
        );

        return imagensComDetalhes;
      } catch (error) {
        console.error("Erro ao carregar imagens com detalhes:", error);
        return [];
      }
    },

    confirmarEnvio(image, categoria) {
      this.itemParaAvaliar = { image, categoria };
      this.showConfirmationModal = true;
    },

    cancelarEnvio() {
      this.showConfirmationModal = false;
      this.itemParaAvaliar = null;
    },

    async baixarComprovante() {
      const usuarioId = this.usuario.id;
      if (!usuarioId) return;

      try {
        const response = await fetch(`${API_URL}/users/${usuarioId}/file`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Não foi possível baixar o comprovante. O usuário pode não ter enviado um ou ocorreu um erro no servidor.");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `comprovante_${this.usuario.name.replace(/\s+/g, "_")}.pdf`;

        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error("Error ao baixar o comprovante", error);
        alert(error.message);
      }
    },

    async executarEnvioNotas() {
      if (!this.itemParaAvaliar) return;
      const { image, categoria } = this.itemParaAvaliar;
      let ratingsPayload;

      if (categoria === "A") {
        const todasAsNotas = this.criterios.every(
          (c) => typeof image.notas[c.id] === "number" && image.notas[c.id] >= 1 && image.notas[c.id] <= 10
        );
        if (!todasAsNotas) {
          alert("Preencha todas as 5 notas de 1 a 10 para a foto.");
          this.cancelarEnvio();
          return;
        }
        ratingsPayload = this.criterios.map((criterio) => ({
          criteria: criterio.id,
          score: image.notas[criterio.id],
        }));
      } else if (categoria === "B") {
        const todasAsNotas = this.criterios.every(
          (c) => typeof this.notasCategoriaB[c.id] === "number" && this.notasCategoriaB[c.id] >= 1 && this.notasCategoriaB[c.id] <= 10
        );
        if (!todasAsNotas) {
          alert("Preencha todas as 5 notas de 1 a 10 para o conjunto.");
          this.cancelarEnvio();
          return;
        }
        ratingsPayload = this.criterios.map((criterio) => ({
          criteria: criterio.id,
          score: this.notasCategoriaB[criterio.id],
        }));
      } else {
        return;
      }

      const body = {
        evaluated_user_id: this.usuario.id,
        evaluator_id: this.user.user_id,
        ratings: ratingsPayload,
        category: categoria,
      };

      try {
        const response = await fetch(`${API_URL}/users/rate/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error("Erro ao enviar notas.");
        alert("Notas enviadas com sucesso!");
        // Recarrega as notas para desabilitar os campos
        await this.carregarNotasCategoria(categoria);
      } catch (error) {
        alert(error.message);
      } finally {
        this.cancelarEnvio();
      }
    },
    async carregarNotasCategoria(categoria) {
      try {
        const response = await fetch(`${API_URL}/images/rate/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({
            user_id: this.usuario.id,
            category: categoria,
            evaluator_id: this.user.user_id,
          }),
        });

        if (!response.ok) return;

        const { ratings } = await response.json();
        const ratingsMap = {};
        ratings.forEach((r) => {
          ratingsMap[r.criteria] = r.rating;
        });

        if (categoria === "B") {
          // Categoria B: notas únicas
          this.criterios.forEach((c) => {
            this.notasCategoriaB[c.id] = ratingsMap[c.id] ?? null;
          });
          this.categoriaBJaAvaliada = this.criterios.every((c) => ratingsMap[c.id] != null);
          console.log("Categoria B já avaliada?", this.categoriaBJaAvaliada);
        } else if (categoria === "A") {
          // Categoria A: aplicar a todas as imagens (ou adaptar se for por imagem individual)
          this.imagensA.forEach((img) => {
            this.criterios.forEach((c) => {
              img.notas[c.id] = ratingsMap[c.id] ?? null;
            });
            img.avaliada = this.criterios.every((c) => img.notas[c.id] != null);
          });
        }
      } catch (error) {
        console.error(`Erro ao carregar notas da categoria ${categoria}:`, error);
      }
    },
  },
};
</script>

<style scoped>
.background-votacao {
  background-color: #f7f9fc;
  min-height: 100vh;
}

.titulo-pagina {
  font-weight: 700;
  color: #333;
}

.titulo-categoria {
  color: #555;
  font-weight: 600;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}

.icon-btn {
  width: 1.2em;
  height: 1.2em;
  margin-right: 0.5rem;
  vertical-align: text-bottom;
}

.categoria-container {
  background-color: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.fotosImg {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
}

.card-votacao {
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-votacao:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.info-conjunto {
  border: 1px solid #e0e0e0;
}

.criterio-input-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.criterio-input-group .form-label {
  font-weight: 500;
  flex: 1;
}

.criterio-input-group .form-control {
  width: 80px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.modal-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 1.5rem;
}

.image-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1060; /* Acima do outro modal */
}

.image-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.image-modal-close-btn {
  position: absolute;
  top: -15px;
  right: -10px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  cursor: pointer;
  transition: background-color 0.2s;
  z-index: 5;
}

.carousel-nav:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.carousel-nav.prev {
  left: -60px;
}

.carousel-nav.next {
  right: -60px;
}

.carousel-counter {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 14px;
}
</style>
