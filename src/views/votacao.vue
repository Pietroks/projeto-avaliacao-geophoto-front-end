<template>
  <section class="background-votacao py-4">
    <div class="container">
      <div v-if="showConfirmationModal" class="modal-overlay"></div>

      <div class="tituloConcurso text-center mb-4">
        <h2>Imagens de {{ usuario.name }}</h2>
      </div>

      <div class="categoria-container mb-5">
        <h3 class="text-center mb-3">Categoria A</h3>
        <div v-if="imagensA.length > 0" class="row g-4 justify-content-center">
          <div v-for="image in imagensA" :key="image.image_id" class="col-12 col-md-8 col-lg-6">
            <div class="card card-votacao h-100">
              <img :src="image.image_url || defaultImage" class="card-img-top fotosImg" alt="Imagem do usuário" />
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ image.nome || "Foto sem nome" }}</h5>
                <h6 v-if="image.local" class="card-subtitle mb-2 text-muted">{{ image.local }}</h6>
                <p v-if="image.equipamento" class="card-text small"><strong>Equipamento:</strong> {{ image.equipamento }}</p>
                <p class="card-text description-text mt-2">
                  {{ image.description }}
                </p>
                <div v-if="isAvaliador" class="mt-auto"></div>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-center text-muted">Não há imagens na Categoria A.</p>
      </div>

      <div class="categoria-container">
        <h3 class="text-center mb-3">Categoria B</h3>
        <div v-if="imagensB.length > 0">
          <div class="card card-body bg-light mb-4 text-dark">
            <h5><strong>Nome do Conjunto:</strong> {{ imagensB[0].nome || "Não informado" }}</h5>
            <p class="mb-1"><strong>Local:</strong> {{ imagensB[0].local || "Não informado" }}</p>
            <p class="mb-0"><strong>Equipamento:</strong> {{ imagensB[0].equipamento || "Não informado" }}</p>
            <p class="mt-2 mb-0"><strong>Descrição do Conjunto:</strong> {{ imagensB[0].description }}</p>
          </div>
          <div class="row g-4">
            <div v-for="image in imagensB" :key="image.image_id" class="col-12 col-md-6 col-lg-4">
              <div class="card card-votacao h-100">
                <img :src="image.image_url || defaultImage" class="card-img-top fotosImg" alt="Imagem do usuário" />
              </div>
            </div>
          </div>

          <div v-if="isAvaliador" class="col-12 mt-4"></div>
        </div>
        <p v-else class="text-center text-muted">Não há imagens na Categoria B.</p>
      </div>
    </div>
  </section>
</template>

<script>
import { API_URL } from "@/config/config.js";
import defaultImage from "@/assets/default.svg";

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

    confirmarEnvio(image) {
      const todasAsNotas = this.criterios.every(
        (c) => typeof image.notas[c.id] === "number" && image.notas[c.id] >= 1 && image.notas[c.id] <= 10
      );
      if (!todasAsNotas) {
        alert("Preencha todas as 5 notas de 1 a 10.");
        return;
      }
      this.photoToSubmit = image;
      this.showConfirmationModal = true;
    },

    cancelarEnvio() {
      this.showConfirmationModal = false;
      this.photoToSubmit = null;
    },

    async executarEnvioNotas(categoria) {
      let ratingsPayload;
      if (categoria === "A") {
        if (!this.photoToSubmit) return;

        ratingsPayload = this.criterios.map((criterio) => ({
          criteria: criterio.id,
          score: this.photoToSubmit.notas[criterio.id],
        }));
      } else if (categoria === "B") {
        ratingsPayload = this.criterios.map((criterio) => ({
          criteria: criterio.id,
          score: this.notasCategoriaB[criterio.id],
        }));
      } else {
        console.error("Categoria inválida");
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
  padding-bottom: 3rem;
}

.tituloConcurso h2 {
  font-weight: 500;
  color: #222;
}

.categoria-container {
  background-color: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.fotosImg {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  background-color: #eee;
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

.description-text {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 1rem;
}

.criterio-input-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.criterio-input-group .form-label {
  font-weight: 500;
  font-size: 0.85rem;
  flex: 1;
}
.criterio-input-group .form-control {
  width: 80px;
  margin-left: 10px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
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
  width: 100%;
  text-align: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.modal-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 1.5rem;
}
</style>
