<template>
  <section class="background-votacao py-4">
    <div class="container">
      <!-- Modal de confirmação -->
      <div v-if="showConfirmationModal" class="modal-overlay">
        <div class="modal-content">
          <h4>Confirmar Envio de Notas?</h4>
          <p>
            Você está prestes a enviar as notas para esta imagem ou conjunto.
            Esta ação não pode ser desfeita.
          </p>
          <div class="modal-actions">
            <button class="btn btn-outline-secondary" @click="cancelarEnvio">
              Cancelar
            </button>
            <button class="btn btn-primary" @click="executarEnvioNotasA">
              Confirmar
            </button>
          </div>
        </div>
      </div>

      <!-- Cabeçalho -->
      <div class="tituloConcurso text-center mb-4">
        <h2>Imagens de {{ usuario.name }}</h2>
      </div>

      <!-- Categoria A -->
      <div class="categoria-container mb-5">
        <h3 class="text-center mb-3">Categoria A</h3>
        <div v-if="imagensA.length > 0" class="row g-4">
          <div
            v-for="image in imagensA"
            :key="image.image_id"
            class="col-12 col-md-6 col-lg-4"
          >
            <div class="card card-votacao h-100">
              <img
                :src="image.image_url || defaultImage"
                class="card-img-top fotosImg"
                alt="Imagem do usuário"
              />
              <div class="card-body d-flex flex-column">
                <p class="card-text description-text">
                  {{ image.description }}
                </p>
                <div v-if="isAvaliador" class="mt-auto">
                  <div
                    v-for="criterio in criterios"
                    :key="criterio.id"
                    class="criterio-input-group mb-2"
                  >
                    <label
                      :for="`nota-${image.image_id}-${criterio.id}`"
                      class="form-label"
                    >
                      {{ criterio.nome }}:
                    </label>
                    <input
                      :id="`nota-${image.image_id}-${criterio.id}`"
                      v-model.number="image.notas[criterio.id]"
                      :disabled="image.avaliado"
                      type="number"
                      class="form-control"
                      min="1"
                      max="10"
                      step="1"
                      placeholder="1-10"
                    />
                  </div>
                  <button
                    v-if="!image.avaliado"
                    class="btn btn-primary w-100 mt-2"
                    @click="confirmarEnvio(image, 'A')"
                  >
                    Avaliar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-center">Não há imagens na Categoria A.</p>
      </div>

      <!-- Categoria B -->
      <div class="categoria-container">
        <h3 class="text-center mb-3">Categoria B</h3>
        <div v-if="imagensB.length > 0" class="row g-4">
          <div
            v-for="image in imagensB"
            :key="image.image_id"
            class="col-12 col-md-4"
          >
            <div class="card card-votacao h-100">
              <img
                :src="image.image_url || defaultImage"
                class="card-img-top fotosImg"
                alt="Imagem do usuário"
              />
              <div class="card-body">
                <p class="card-text description-text">
                  {{ image.description }}
                </p>
              </div>
            </div>
          </div>
          <div class="col-12 mt-4">
            <div v-if="isAvaliador">
              <div
                v-for="criterio in criterios"
                :key="criterio.id"
                class="criterio-input-group mb-2"
              >
                <label class="form-label">{{ criterio.nome }}:</label>
                <input
                  v-model.number="notasCategoriaB[criterio.id]"
                  :disabled="bAvaliadas"
                  type="number"
                  class="form-control"
                  min="1"
                  max="10"
                  step="1"
                  placeholder="1-10"
                />
              </div>
              <button
                v-if="!bAvaliadas"
                class="btn btn-primary w-100 mt-2"
                @click="confirmarEnvio(null, 'B')"
              >
                Avaliar Conjunto Categoria B
              </button>
            </div>
          </div>
        </div>
        <p v-else class="text-center">Não há imagens na Categoria B.</p>
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
      notasCategoriaB: {},
      bAvaliadas: false,
      showConfirmationModal: false,
      avaliacaoCategoria: "A",
      photoToSubmit: null,
      defaultImage,
      criterios: [
        { id: "criatividade", nome: "Criatividade" },
        { id: "composicao", nome: "Composição" },
        { id: "tecnica", nome: "Qualidade Técnica" },
        { id: "impacto", nome: "Impacto Visual" },
        { id: "tema", nome: "Adequação ao Tema" },
      ],
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
      const userRes = await fetch(`${API_URL}/users/${usuarioId}/`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (!userRes.ok) throw new Error();
      this.usuario = await userRes.json();

      const [imagens, avaliacoesRes] = await Promise.all([
        this.carregarImagensComDetalhes(usuarioId),
        fetch(
          `${API_URL}/ratings/user/${usuarioId}/evaluator/${this.user.user_id}/`,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        ),
      ]);

      const avaliacoes = avaliacoesRes.ok ? await avaliacoesRes.json() : {};

      this.imagensA = imagens.filter((img) => {
        img.subcategory === "A";
        img.avaliado = false;
        const notaExistente = (avaliacoes.category_a || []).find(
          (r) => r.image_id === img.image_id
        );
        if (notaExistente) {
          img.avaliado = true;
          notaExistente.ratings.forEach((r) => {
            img.notas[r.criteria] = r.score;
          });
        }
        return img.subcategory === "A";
      });

      this.imagensB = imagens.filter((img) => img.subcategory === "B");
      if (avaliacoes.category_b) {
        this.bAvaliadas = true;
        avaliacoes.category_b.ratings.forEach((r) => {
          this.notasCategoriaB[r.criteria] = r.score;
        });
      } else {
        this.criterios.forEach((c) => (this.notasCategoriaB[c.id] = null));
      }
    } catch (err) {
      alert("Erro ao carregar dados.");
    }
  },
  methods: {
    async carregarImagensComDetalhes(usuarioId) {
      const res = await fetch(`${API_URL}/user/images/${usuarioId}/`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (!res.ok) return [];
      const images = await res.json();
      return images.map((img) => {
        const notas = {};
        this.criterios.forEach((c) => (notas[c.id] = null));
        return {
          ...img,
          image_url: `${API_URL}/images/${img.image_id}/`,
          notas,
        };
      });
    },

    confirmarEnvio(image, categoria) {
      this.photoToSubmit = image;
      this.avaliacaoCategoria = categoria;
      if (categoria === "A") {
        const notasOk = this.criterios.every(
          (c) =>
            typeof image.notas[c.id] === "number" &&
            image.notas[c.id] >= 1 &&
            image.notas[c.id] <= 10
        );
        if (!notasOk) return alert("Preencha todas as notas de 1 a 10.");
      } else {
        const notasOk = this.criterios.every(
          (c) =>
            typeof this.notasCategoriaB[c.id] === "number" &&
            this.notasCategoriaB[c.id] >= 1 &&
            this.notasCategoriaB[c.id] <= 10
        );
        if (!notasOk) return alert("Preencha todas as notas de 1 a 10.");
      }
      this.showConfirmationModal = true;
    },

    cancelarEnvio() {
      this.showConfirmationModal = false;
      this.photoToSubmit = null;
    },

    async executarEnvioNotasA() {
      const ratingsPayload = this.criterios.map((criterio) => ({
        criteria: criterio.id,
        score:
          this.avaliacaoCategoria === "A"
            ? this.photoToSubmit.notas[criterio.id]
            : this.notasCategoriaB[criterio.id],
      }));

      const body = {
        evaluated_user_id: this.usuario.id,
        evaluator_id: this.user.user_id,
        ratings: ratingsPayload,
        category: this.avaliacaoCategoria,
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
        if (this.avaliacaoCategoria === "A") this.photoToSubmit.avaliado = true;
        else this.bAvaliadas = true;
        this.cancelarEnvio();
      } catch (error) {
        alert(error.message);
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
