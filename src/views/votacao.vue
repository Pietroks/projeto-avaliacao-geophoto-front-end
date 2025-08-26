<template>
  <section class="background-votacao py-5">
    <div class="container">
      <Modal v-model="modalState.show" :title="modalState.title" :message="modalState.message" :type="modalState.type" />
      <ImageModal :visible="isModalVisible" :images="modalImages" :start-index="modalStartIndex" @close="isModalVisible = false" />

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

      <div v-if="usuario.name" class="text-center mb-5">
        <h2 class="titulo-pagina">
          Avaliando fotos de: <strong>{{ usuario.name }}</strong>
        </h2>
        <p class="text-muted">Categoria de Formação: {{ categoriaFormatada }}</p>
        <button v-if="isAvaliador" @click="baixarComprovante" class="btn btn-info mt-2">
          <ArrowDownTrayIcon class="icon-btn" />
          Baixar Comprovante de Matrícula
        </button>
      </div>

      <div class="categoria-container mb-5">
        <h3 class="titulo-categoria">Categoria A</h3>
        <div v-if="imagensA.length > 0" class="row g-4 justify-content-center">
          <div v-for="(image, index) in imagensA" :key="image.image_id" class="col-12 col-md-10 col-lg-8">
            <div class="card card-votacao h-100">
              <img
                :src="image.image_url || defaultImage"
                class="card-img-top fotosImg"
                alt="Imagem do usuário"
                @click="openModal(imagensA, index)"
              />
              <div class="card-body d-flex flex-column">
                <h5 class="card-title"><strong>Titulo: </strong>{{ image.title || "Foto sem nome" }}</h5>
                <h6 v-if="image.place" class="card-subtitle mb-2"><strong>Local: </strong>{{ image.place }}</h6>
                <p v-if="image.equipment" class="card-text"><strong>Equipamento:</strong> {{ image.equipment }}</p>
                <p class="card-text description-text mb-2"><strong>Descrição: </strong>{{ image.description }}</p>

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
                      @input="validarNota(image.notas, criterio.id)"
                    />
                  </div>
                  <div v-if="image.avaliada && image.media" class="alert alert-success mt-3 text-center">
                    <strong>Média da Foto: {{ image.media.toFixed(2) }}</strong>
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
            <h5><strong>Nome do Conjunto:</strong> {{ imagensB[0].title || "Não informado" }}</h5>
            <p class="mb-1"><strong>Local:</strong> {{ imagensB[0].place || "Não informado" }}</p>
            <p class="mb-0"><strong>Equipamento:</strong> {{ imagensB[0].equipment || "Não informado" }}</p>
            <p class="mt-2 mb-0"><strong>Descrição do Conjunto:</strong> {{ imagensB[0].description }}</p>
          </div>

          <div class="row g-4">
            <div v-for="(image, index) in imagensB" :key="image.image_id" class="col-12 col-md-6 col-lg-4">
              <div class="card card-votacao h-100">
                <img
                  :src="image.image_url || defaultImage"
                  class="card-img-top fotosImg"
                  alt="Imagem do usuário"
                  @click="openModal(imagensB, index)"
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
                  @input="validarNota(notasCategoriaB, criterio.id)"
                />
              </div>
              <div v-if="categoriaBJaAvaliada && mediaCategoriaB" class="alert alert-success mt-3 text-center">
                <strong>Média do Conjunto: {{ mediaCategoriaB.toFixed(2) }}</strong>
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
import ImageModal from "@/components/ImageModal.vue";
import Modal from "@/components/Modal.vue";

export default {
  name: "VotacaoPage",
  components: { ArrowDownTrayIcon, ImageModal, Modal },
  data() {
    return {
      usuario: {},
      imagensA: [],
      imagensB: [],
      showConfirmationModal: false,
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
      mediaCategoriaB: null,
      isModalVisible: false,
      modalImages: [],
      modalStartIndex: 0,
      modalState: {
        show: false,
        title: "",
        message: "",
        type: "info",
      },
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
    categoriaFormatada() {
      const mapaCategorias = {
        1: "Estudante de Graduação",
        2: "Estudante de Pós-Graduação",
        3: "Graduado",
      };
      return mapaCategorias[this.usuario.category] || "Não informado";
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
        this.triggerModal("Erro", "Erro ao carregar os dados do usuário. Faça login novamente.", "error");
        this.logout();
      }
    } catch (error) {
      this.triggerModal("Erro de Conexão", "Erro na comunicação com o servidor. Verifique sua conexão.", "error");
    }
  },
  methods: {
    triggerModal(title, message, type = "info") {
      this.modalState.title = title;
      this.modalState.message = message;
      this.modalState.type = type;
      this.modalState.show = true;
    },

    openModal(images, index = 0) {
      this.modalImages = images;
      this.modalStartIndex = index;
      this.isModalVisible = true;
    },

    validarNota(notas, criterioId) {
      const nota = notas[criterioId];
      if (nota < 1) notas[criterioId] = 1;
      if (nota > 10) notas[criterioId] = 10;
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
            const notas = {};
            this.criterios.forEach((c) => {
              notas[c.id] = null;
            });

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
              media: null,
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
        this.triggerModal("Erro no Download", error.message, "error");
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
          this.triggerModal("Atenção", "Preencha todas as 5 notas, com valores de 1 a 10, para a foto.", "info");
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
          this.triggerModal("Atenção", "Preencha todas as 5 notas, com valores de 1 a 10, para o conjunto.", "info");
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
        this.triggerModal("Sucesso", "Notas enviadas com sucesso!", "success");
        await this.carregarNotasCategoria(categoria);
      } catch (error) {
        this.triggerModal("Erro no Envio", error.message, "error");
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
          this.criterios.forEach((c) => {
            this.notasCategoriaB[c.id] = ratingsMap[c.id] ?? null;
          });
          this.categoriaBJaAvaliada = this.criterios.every((c) => ratingsMap[c.id] != null);
          console.log("Categoria B já avaliada?", this.categoriaBJaAvaliada);
          if (this.categoriaBJaAvaliada) {
            const notas = Object.values(this.notasCategoriaB);
            const soma = notas.reduce((acc, nota) => acc + nota, 0);
            this.mediaCategoriaB = soma / notas.length;
          }
        } else if (categoria === "A") {
          this.imagensA.forEach((img) => {
            this.criterios.forEach((c) => {
              img.notas[c.id] = ratingsMap[c.id] ?? null;
            });
            img.avaliada = this.criterios.every((c) => img.notas[c.id] != null);
            if (img.avaliada) {
              const notas = Object.values(img.notas);
              const soma = notas.reduce((acc, nota) => acc + nota, 0);
              img.media = soma / notas.length;
            }
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
/* --- Configurações Globais e Fundo --- */
/* Adicionado um gradiente sutil para dar profundidade e uma aparência menos "chapada". */
.background-votacao {
  background: linear-gradient(180deg, #fdfdff 0%, #f7f9fc 100%);
  min-height: 100vh;
}

/* --- Tipografia e Títulos --- */
/* Aumentado o tamanho e o contraste para maior impacto e clareza. */
.titulo-pagina {
  font-size: 2.5rem; /* Mais destaque */
  font-weight: 700;
  color: #1a202c; /* Um preto mais suave que o #000 */
}

/* A borda agora é mais curta e colorida, agindo como um acento visual. */
.titulo-categoria {
  font-size: 1.75rem;
  color: #2d3748;
  font-weight: 600;
  border-bottom: 3px solid #007bff; /* Usando uma cor primária */
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem; /* Mais espaço abaixo do título */
  display: inline-block; /* Faz a borda ter o tamanho do texto */
}

/* --- Botões e Ícones --- */
.icon-btn {
  width: 1.2em;
  height: 1.2em;
  margin-right: 0.5rem;
  vertical-align: -0.25em; /* Melhor alinhamento vertical */
}

/* --- Estrutura e Cards --- */
/* Sombra mais suave e um arredondamento maior para um look moderno. */
.categoria-container {
  background-color: #fff;
  border-radius: 16px; /* Mais arredondado */
  padding: 2rem 2.5rem; /* Mais espaçamento interno */
  box-shadow: 0 8px 24px rgba(26, 32, 44, 0.08);
  transition: all 0.3s ease;
}

/* Efeito de "levantar" o container no hover. */
.categoria-container:hover {
  box-shadow: 0 12px 32px rgba(26, 32, 44, 0.12);
  transform: translateY(-2px);
}

/* Sombra mais sutil e transição mais elaborada (cubic-bezier) para um movimento natural. */
.card-votacao {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden; /* Garante que a imagem não saia dos cantos arredondados */
}

/* Efeito de hover mais pronunciado, combinando elevação e uma sombra mais forte. */
.card-votacao:hover {
  transform: translateY(-8px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.08);
}

/* Efeito de zoom na imagem para indicar interatividade. */
.card-votacao:hover .fotosImg {
  transform: scale(1.05);
}

/* --- Imagens --- */
.fotosImg {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 8px 8px 0 0; /* Arredondado apenas nos cantos superiores */
  cursor: pointer;
  transition: transform 0.4s ease; /* Transição suave para o efeito de hover */
}

/* --- Elementos de Informação e Formulário --- */
/* Um estilo mais limpo para a caixa de informações do conjunto. */
.info-conjunto {
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
}

/* Melhor alinhamento e espaçamento para os campos de nota. */
.criterio-input-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem; /* Espaço entre o label e o input */
}

.criterio-input-group .form-label {
  font-weight: 500;
  color: #4a5568;
  flex: 1;
}

/* Inputs com aparência moderna e feedback visual claro no estado :focus. */
.criterio-input-group .form-control {
  width: 85px;
  text-align: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem;
  transition: all 0.2s ease;
  font-weight: 600;
  font-size: 1rem;
}

.criterio-input-group .form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
}

/* --- Estilos do Modal --- */
/* Efeito de fade-in para o overlay do modal. */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(26, 32, 44, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  backdrop-filter: blur(4px); /* Efeito de vidro fosco no fundo */
}

/* Animação de entrada para o conteúdo do modal (aparece de baixo para cima). */
.modal-content {
  background-color: white;
  padding: 2rem 2.5rem;
  border-radius: 16px;
  max-width: 420px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform: translateY(20px);
  opacity: 0;
  animation: slide-up 0.4s forwards;
}

@keyframes slide-up {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-actions {
  display: flex;
  justify-content: center; /* Centraliza os botões */
  gap: 1rem; /* Espaço entre os botões */
  margin-top: 1.5rem;
}

/* --- Estilos do Modal de Imagem (Carrossel) --- */
.image-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.85); /* Mais escuro para focar na imagem */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1060;
  backdrop-filter: blur(8px);
}

.image-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

/* Botão de fechar mais elegante. */
.image-modal-close-btn {
  position: absolute;
  top: 15px; /* Dentro da área visível */
  right: 15px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.image-modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
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
  border-radius: 12px;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
}

/* Botões de navegação mais modernos e posicionados de forma diferente. */
.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(26, 32, 44, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-nav:hover {
  background-color: #007bff;
  transform: translateY(-50%) scale(1.1);
}

.carousel-nav.prev {
  left: 20px;
}

.carousel-nav.next {
  right: 20px;
}

/* Contador de imagens com melhor design. */
.carousel-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(26, 32, 44, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}
</style>
