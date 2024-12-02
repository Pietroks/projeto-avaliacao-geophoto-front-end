<template>
  <div>
    <h1>Painel de Administração</h1>
    <p>Envie um código de cadastro para avaliadores do concurso.</p>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="divForm">
            <h2>Enviar código de cadastro:</h2>
            <p>Informe o e-mail do avaliador para enviar um código de acesso.</p>
            <input v-model="email" type="email" placeholder="E-mail do avaliador" />
            <button :disabled="isSending" @click="sendInvite">
              {{ isSending ? "Enviando..." : "Enviar" }}
            </button>
            <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URL } from "@/config/config";

export default {
  name: "AdminPage",
  data() {
    return {
      email: "",
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
    if (!this.email) {
      this.errorMessage = "Por favor, insira um e-mail válido.";
      this.successMessage = "";
      return;
    }

    this.isSending = true;
    this.errorMessage = "";
    this.successMessage = "";

    try {
      const response = await fetch(`${API_URL}/avaliadores/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ email: this.email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao enviar convite.");
      }

      this.successMessage = `Convite enviado com sucesso para ${this.email}!`;
      this.email = "";
    } catch (error) {
      this.errorMessage = error.message || "Erro ao enviar convite.";
    } finally {
      this.isSending = false;
    }
  }
  },
};
</script>

<style scoped>
.divForm {
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: #f9f9f9;
  margin-top: 2rem;
}
input {
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  padding: 0.8rem 1.5rem;
  background: purple;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}
button:disabled {
  background: gray;
  cursor: not-allowed;
}
button:hover:enabled {
  background: #5a1a87;
}
.success-message {
  color: green;
  margin-top: 1rem;
}
.error-message {
  color: red;
  margin-top: 1rem;
}
</style>
