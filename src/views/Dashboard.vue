<template>
  <div class="dashboard">
    <h1>Bem-vindo, {{ user?.nome || 'Usuário' }}</h1>
    <p>Email: {{ user?.email || 'Não informado' }}</p>

    <div class="upload-section">
      <h2>Envie suas fotos para o concurso</h2>
      <form @submit.prevent="uploadPhoto">
        <input type="file" @change="handleFileChange" />
        <button type="submit" :disabled="isUploading">
          {{ isUploading ? 'Enviando...' : 'Enviar Foto' }}
        </button>
      </form>
    </div>

    <button @click="logout" class="btn btn-danger">Sair</button>
  </div>
</template>

<script>
export default {
  name: "DashboardPage",
  computed: {
    user() {
      return this.$store.getters["user/user"]; // Obtém o usuário autenticado do Vuex Store
    },
  },
  data() {
    return {
      photoFile: null, // Para armazenar o arquivo selecionado
      isUploading: false, // Indica se o upload está em andamento
    };
  },
  beforeMount() {
    // Verifica se o usuário está autenticado antes de carregar a página
    if (!this.$store.getters["user/isAuthenticated"]) {
      this.$router.push("/login"); // Redireciona para login se não estiver autenticado
    }
  },
  methods: {
    handleFileChange(event) {
      this.photoFile = event.target.files[0];
    },
    async uploadPhoto() {
      if (!this.photoFile) {
        alert("Por favor, selecione uma foto.");
        return;
      }

      this.isUploading = true; // Inicia o estado de carregamento
      try {
        const formData = new FormData();
        formData.append("photo", this.photoFile);
        formData.append("userId", this.user.id);

        const response = await fetch("/api/photos/upload", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${this.$store.getters["user/token"]}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao enviar a foto.");
        }

        alert("Foto enviada com sucesso!");
      } catch (error) {
        alert(error.message || "Erro ao enviar foto. Tente novamente.");
      } finally {
        this.isUploading = false; // Finaliza o estado de carregamento
        this.photoFile = null; // Limpa o estado após o envio
      }
    },
    logout() {
      this.$store.dispatch("user/logout"); // Desloga o usuário
      this.$router.push("/login"); // Redireciona para a página de login
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}

.upload-section {
  margin-top: 2rem;
}

.upload-section form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
</style>
