<template>
  <div class="admin-container">
    <h1 class="mb-2 text-center">Painel de Administração</h1>
    <p class="text-center mb-4">
      Envie um código de cadastro para avaliadores do concurso.
    </p>

    <div class="form-card">
      <h2>Convidar Avaliador</h2>
      <p class="mb-3">
        Informe o nome e o e-mail do avaliador para enviar um código de acesso:
      </p>

      <input
        v-model="name"
        type="text"
        placeholder="Nome do avaliador"
        class="form-control mb-3"
        required
      />

      <input
        v-model="document"
        type="text"
        placeholder="Documento do avaliador"
        class="form-control mb-3"
        required
      />

      <input
        v-model="email"
        type="email"
        placeholder="E-mail do avaliador"
        class="form-control"
        required
      />

      <button class="btn mt-3" :disabled="isSending" @click="sendInvite">
        {{ isSending ? "Enviando..." : "Enviar Convite" }}
      </button>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script>
import { API_URL } from "@/config/config";

export default {
  name: "AdminPage",
  data() {
    return {
      name: "",
      email: "",
      document:"",
      isSending: false,
      successMessage: "",
      errorMessage: "",
    };
  },
  computed: {
    token() {
      return this.$store.getters["user/token"];
    },
  },
  methods: {
    async sendInvite() {
      if (!this.name.trim()) {
        this.errorMessage = "Por favor, insira o nome do avaliador.";
        this.successMessage = "";
        return;
      }

      if (!this.document.trim()) {
        this.errorMessage = "Por favor, insira o documento do avaliador.";
        this.successMessage = "";
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.email || !emailRegex.test(this.email)) {
        this.errorMessage = "Por favor, insira um e-mail válido.";
        this.successMessage = "";
        return;
      }

      this.isSending = true;
      this.errorMessage = "";
      this.successMessage = "";

      try {
        const response = await fetch(`${API_URL}/invite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,

          },
          
          body: JSON.stringify({ name: this.name, email: this.email, document: this.document }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || "Erro ao enviar convite.");
        }

        this.successMessage = `Convite enviado para ${this.name} (${this.email})!`;
        this.name = ""; 
        this.email = "";
      } catch (error) {
        this.errorMessage = error.message || "Erro ao enviar convite.";
      } finally {
        this.isSending = false;
      }
    },
  },
};
</script>

<style scoped>
.admin-container {
  max-width: 500px;
  margin: 4rem auto;
  padding: 1rem;
}

.form-card {
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  border: 1px solid #ddd;
  text-align: center;
}

input.form-control {
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

button.btn {
  background-color: #6f42c1;
  color: #fff;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  width: 100%;
  border: none;
  border-radius: 6px;
  transition: background 0.3s ease;
}

button.btn:hover:enabled {
  background-color: #5a35a0;
}

button.btn:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.success-message {
  margin-top: 1rem;
  color: #28a745;
  font-weight: 500;
}

.error-message {
  margin-top: 1rem;
  color: #dc3545;
  font-weight: 500;
}
</style>