<template>
  <section class="background1">
    <div class="container">
      <div class="text-center mb-4">
        <h2 class="tituloConcurso">Concorrentes Inscritos</h2>

        <!-- Filtros -->
        <div class="row justify-content-center mt-4">
          <div class="col-md-4 mb-2">
            <input
              v-model="searchTerm"
              type="text"
              class="form-control"
              placeholder="Buscar por nome..."
            />
          </div>
          <div class="col-md-4 mb-2">
            <select v-model="selectedCategory" class="form-select">
              <option value="">Todas as categorias</option>
              <option
                v-for="(label, index) in categoryOptions"
                :key="index"
                :value="label"
              >
                {{ label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Lista de usuários -->
      <div class="row g-4">
        <div
          v-for="usuario in paginatedUsuarios"
          :key="usuario.id"
          class="col-12 col-md-6 col-lg-3 text-center"
        >
          <div class="divUsuario">
            <p>
              <strong>{{ usuario.name }}</strong>
            </p>
            <p class="text-muted">Categoria: {{ usuario.category }}</p>
            <p class="text-light small">Fotos A: {{ usuario.fotosA }} / 1</p>
            <p class="text-light small">Fotos B: {{ usuario.fotosB }} / 3</p>
            <span v-if="usuario.avaliado" class="badge bg-success mt-2"
              >Avaliado</span
            >
            <button
              @click="redirecionarParaVotacao(usuario.id)"
              class="btn btn-primary mt-2"
            >
              Ver Imagens
            </button>
          </div>
        </div>
      </div>

      <!-- Paginação -->
      <div class="d-flex justify-content-center mt-5">
        <button
          class="btn btn-secondary me-2"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Anterior
        </button>
        <button
          class="btn btn-secondary"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Próxima
        </button>
      </div>

      <p
        v-if="filteredUsuarios.length === 0"
        class="text-light text-center mt-5"
      >
        Nenhum concorrente encontrado.
      </p>
    </div>
  </section>
</template>

<script>
import { API_URL } from "@/config/config.js";

export default {
  name: "ConcursoPage",
  data() {
    return {
      usuarios: [],
      searchTerm: "",
      selectedCategory: "",
      currentPage: 1,
      itemsPerPage: 8,
      categoryOptions: ["Graduado", "Pós-Graduado", "Outros"],
    };
  },
  computed: {
    filteredUsuarios() {
      return this.usuarios.filter((user) => {
        const matchNome = user.name
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
        const matchCategoria =
          !this.selectedCategory || user.category === this.selectedCategory;
        return matchNome && matchCategoria;
      });
    },
    paginatedUsuarios() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredUsuarios.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredUsuarios.length / this.itemsPerPage);
    },
  },
  async created() {
    const token = this.$store.getters["user/token"];
    const currentUserId = this.$store.getters["user/user"]?.user_id;
    try {
      const response = await fetch(`${API_URL}/users/participants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao carregar usuários");
      const data = await response.json();

      const enriched = await Promise.all(
        data.map(async (usuario) => {
          const imagesRes = await fetch(
            `${API_URL}/user/images/${usuario.id}/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const ratingsRes = await fetch(
            `${API_URL}/users/${usuario.id}/ratings/evaluator/${currentUserId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          let fotos = [];
          if (imagesRes.ok) fotos = await imagesRes.json();
          const fotosA = fotos.filter((f) => f.subcategory === "A").length;
          const fotosB = fotos.filter((f) => f.subcategory === "B").length;

          const avaliado =
            ratingsRes.ok && (await ratingsRes.json()).length > 0;

          return {
            ...usuario,
            category:
              ["Graduado", "Pós-Graduado", "Outros"][usuario.category - 1] ||
              "Não Informado",
            fotosA,
            fotosB,
            avaliado,
          };
        })
      );

      this.usuarios = enriched;
    } catch (error) {
      console.error("Erro:", error.message);
      alert("Erro ao carregar usuários.");
    }
  },
  methods: {
    redirecionarParaVotacao(usuarioId) {
      this.$router.push({ name: "votacao", params: { id: usuarioId } });
    },
  },
};
</script>

<style scoped>
.background1 {
  background-color: #010020;
  padding: 4rem 0;
}

.tituloConcurso {
  color: #a52a2a;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.divUsuario {
  background: #222;
  border-radius: 15px;
  padding: 1.5rem;
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: #eee;
  height: 100%;
}

.divUsuario:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

.btn-primary {
  background-color: #137abe;
  border-color: #137abe;
  margin-top: 1rem;
  font-size: 1rem;
  border-radius: 12px;
  padding: 0.5rem 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: 0.3s ease-in-out;
}

.btn-primary:hover {
  background-color: #1e5f8e;
  border-color: #1e5f8e;
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}
</style>
