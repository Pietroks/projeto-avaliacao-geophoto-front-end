<template>
  <section class="background-votacao">
    <div class="container py-5">
      <div class="text-center mb-5">
        <h2 class="titulo-pagina">Galeria de Concorrentes</h2>
        <p class="subtitulo-pagina">Navegue pelos participantes e escolha suas fotos favoritas para avaliar.</p>
      </div>

      <div class="row justify-content-center mb-4 g-3">
        <div class="col-md-5">
          <div class="input-group">
            <span class="input-group-text"><i class="fas fa-search"></i></span>
            <input v-model="searchTerm" type="text" class="form-control" placeholder="Buscar por nome do concorrente..." />
          </div>
        </div>
        <div class="col-md-4">
          <div class="input-group">
            <span class="input-group-text"><i class="fas fa-graduation-cap"></i></span>
            <select v-model="selectedCategory" class="form-select">
              <option value="">Todas as categorias</option>
              <option v-for="category in categoryOptions" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="paginatedUsuarios.length > 0" class="row g-4">
        <div v-for="usuario in paginatedUsuarios" :key="usuario.id" class="col-12 col-sm-6 col-lg-3">
          <div class="user-card">
            <UserCircleIcon class="avatar-icon" />
            <h5 class="user-name mt-3">{{ usuario.name }}</h5>
            <span class="user-category">{{ usuario.category }}</span>
            <button @click="redirecionarParaVotacao(usuario.id)" class="btn btn-votacao mt-4">Avaliar Fotos</button>
          </div>
        </div>
      </div>

      <p v-else class="text-light text-center mt-5">Nenhum concorrente encontrado com os filtros aplicados.</p>

      <div v-if="totalPages > 1" class="d-flex justify-content-center align-items-center mt-5">
        <button class="btn btn-pagination" :disabled="currentPage === 1" @click="currentPage--">
          <i class="fas fa-arrow-left"></i>
        </button>
        <span class="pagina-info mx-3">Página {{ currentPage }} de {{ totalPages }}</span>
        <button class="btn btn-pagination" :disabled="currentPage === totalPages" @click="currentPage++">
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>

      <Modal
        v-model="isModalVisible"
        :title="modal.title"
        :message="modal.message"
        :buttonText="modal.buttonText"
        :type="modal.type"
        @confirm="handleModalConfirm"
      />
    </div>
  </section>
</template>

<script>
import { API_URL } from "@/config/config.js";
import { UserCircleIcon } from "@heroicons/vue/24/solid";
import Modal from "@/components/Modal.vue";

const categoryMap = {
  1: "Estudante de Graduação",
  2: "Estudante de Pós-Graduação",
  3: "Graduado",
};

export default {
  name: "ConcursoPage",
  components: { Modal, UserCircleIcon },
  data() {
    return {
      usuarios: [],
      searchTerm: "",
      selectedCategory: "",
      currentPage: 1,
      itemsPerPage: 8,
      categoryOptions: Object.values(categoryMap),
      isModalVisible: false,
      modal: {
        title: "",
        message: "",
        buttonText: "OK",
        type: "info",
        action: null,
      },
    };
  },
  computed: {
    filteredUsuarios() {
      return this.usuarios.filter((user) => {
        const matchNome = user.name.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchCategoria = !this.selectedCategory || user.category === this.selectedCategory;
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
    try {
      const response = await fetch(`${API_URL}/users/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.$store.getters["user/token"]}`,
        },
      });
      if (!response.ok) throw new Error("Erro ao carregar usuários");

      const data = await response.json();

      this.usuarios = data
        .filter((user) => user.user_type !== "A" && user.user_type !== "E")
        .map((usuario) => ({
          ...usuario,
          category: categoryMap[usuario.category] || "Não Informado",
        }));
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      this.showAlert(
        "Sessão Expirada",
        "Não foi possível carregar os concorrentes. Por favor, faça login novamente.",
        "error",
        "Ir para Login",
        () => this.logout()
      );
    }
  },

  watch: {
    searchTerm() {
      this.currentPage = 1;
    },
    selectedCategory() {
      this.currentPage = 1;
    },
  },

  methods: {
    showAlert(title, message, type = "info", buttonText = "OK", action = null) {
      this.modal.title = title;
      this.modal.message = message;
      this.modal.type = type;
      this.modal.buttonText = buttonText;
      this.modal.action = action;
      this.isModalVisible = true;
    },

    handleModalConfirm() {
      if (typeof this.modal.action === "function") {
        this.modal.action();
      }
    },

    logout() {
      this.$store.dispatch("user/logout");
      this.$router.push("/login");
    },
    redirecionarParaVotacao(usuarioId) {
      this.$router.push({ name: "votacao", params: { id: usuarioId } });
    },
    onImageError(event) {
      event.target.src = this.defaultImage;
    },
  },
};
</script>

<style scoped>
.background-votacao {
  background: linear-gradient(135deg, #1d2b4a, #0f172a);
  color: #e2e8f0;
  min-height: 100vh;
}

.titulo-pagina {
  color: #fff;
  font-weight: 700;
  font-size: 2.8rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.subtitulo-pagina {
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto;
}

.form-control,
.form-select {
  background-color: #1e293b;
  border-color: #334155;
  color: #e2e8f0;
}
.form-control::placeholder {
  color: #94a3b8;
}
.form-control:focus,
.form-select:focus {
  background-color: #1e293b;
  border-color: #38bdf8;
  box-shadow: 0 0 0 0.25rem rgba(56, 189, 248, 0.25);
  color: #e2e8f0;
}
.input-group-text {
  background-color: #334155;
  border-color: #334155;
  color: #94a3b8;
}

.user-card {
  background: #1e293b;
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  transition: all 0.3s ease;
  border: 1px solid #334155;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.user-card:hover {
  transform: translateY(-8px);
  border-color: #38bdf8;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}

.avatar-icon {
  width: 80px;
  height: 80px;
  color: #38bdf8;
  background-color: #334155;
  border-radius: 50%;
  padding: 10px;
}

.user-name {
  color: #fff;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.user-category {
  font-size: 0.9rem;
  color: #94a3b8;
  background-color: #334155;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
}

.btn-votacao {
  background-color: #38bdf8;
  color: #0f172a;
  border: none;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.6rem 1.5rem;
  width: 100%;
  transition: all 0.2s ease;
}

.btn-votacao:hover {
  background-color: #7dd3fc;
  transform: scale(1.03);
}

/* Estilo da Paginação */
.btn-pagination {
  background-color: #334155;
  color: #e2e8f0;
  border: 1px solid #475569;
}
.btn-pagination:disabled {
  background-color: #1e293b;
  color: #475569;
}
.pagina-info {
  color: #94a3b8;
  font-weight: 500;
}
</style>
