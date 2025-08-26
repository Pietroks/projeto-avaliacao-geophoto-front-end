<template>
  <div class="admin-page">
    <Modal v-model="modalState.show" :title="modalState.title" :message="modalState.message" :type="modalState.type" />

    <div class="admin-container">
      <div class="text-center">
        <h1 class="title">Painel de Administração</h1>
        <p class="subtitle">Envie um convite com um código de acesso para os avaliadores do concurso.</p>
      </div>

      <form class="form-card" @submit.prevent="sendInvite">
        <h2 class="form-title">Convidar Avaliador</h2>

        <div class="form-group">
          <label for="name">Nome completo</label>
          <input id="name" v-model="name" type="text" placeholder="Nome do avaliador" class="form-control" required />
        </div>

        <div class="form-group">
          <label for="document">CPF</label>
          <input id="document" v-model="document" type="text" placeholder="000.000.000-00" class="form-control" required maxlength="14" />
        </div>

        <div class="form-group">
          <label for="email">E-mail</label>
          <input id="email" v-model="email" type="email" placeholder="E-mail do avaliador" class="form-control" required />
        </div>

        <button type="submit" class="btn-submit" :disabled="isSending">
          {{ isSending ? "Enviando..." : "Enviar Convite" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { API_URL } from "@/config/config";
import Modal from "@/components/Modal.vue";

export default {
  name: "AdminPage",
  components: {
    Modal,
  },
  data() {
    return {
      name: "",
      email: "",
      document: "",
      isSending: false,
      modalState: {
        show: false,
        title: "",
        message: "",
        type: "info",
      },
    };
  },
  computed: {
    token() {
      return this.$store.getters["user/token"];
    },
  },
  watch: {
    document(value) {
      const numericValue = value.replace(/\D/g, "");
      let formattedValue = numericValue
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      if (value != formattedValue) {
        this.document = formattedValue;
      }
    },
  },
  methods: {
    triggerModal(title, message, type = "info") {
      this.modalState.title = title;
      this.modalState.message = message;
      this.modalState.type = type;
      this.modalState.show = true;
    },

    validateCPF(cpf) {
      const cpfClean = String(cpf).replace(/\D/g, "");

      if (cpfClean.length !== 11 || /^(\d)\1{10}$/.test(cpfClean)) {
        return false;
      }

      let sum = 0;
      let remainder;

      for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpfClean.substring(i - 1, i)) * (11 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) {
        remainder = 0;
      }
      if (remainder !== parseInt(cpfClean.substring(9, 10))) {
        return false;
      }

      sum = 0;
      for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpfClean.substring(i - 1, i)) * (12 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) {
        remainder = 0;
      }
      if (remainder !== parseInt(cpfClean.substring(10, 11))) {
        return false;
      }

      return true;
    },

    validateForm() {
      if (!this.name.trim()) {
        this.triggerModal("Campo Obrigatório", "Por favor, insira o nome do avaliador.", "error");
        return false;
      }
      if (!this.validateCPF(this.document)) {
        this.triggerModal("CPF Inválido", "O CPF inserido não é válido. Por favor, verifique os dígitos.", "error");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.email || !emailRegex.test(this.email)) {
        this.triggerModal("E-mail Inválido", "Por favor, insira um endereço de e-mail válido.", "error");
        return false;
      }
      return true;
    },
    async sendInvite() {
      if (!this.validateForm()) {
        return;
      }

      this.isSending = true;

      try {
        const response = await fetch(`${API_URL}/invite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            document: this.document,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || "Ocorreu um erro ao enviar o convite.");
        }

        this.triggerModal("Sucesso!", `O convite foi enviado para ${this.name} (${this.email}).`, "success");
        this.name = "";
        this.email = "";
        this.document = "";
      } catch (error) {
        this.triggerModal("Erro no Envio", error.message, "error");
      } finally {
        this.isSending = false;
      }
    },
  },
};
</script>

<style scoped>
.admin-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}

.admin-container {
  width: 100%;
  max-width: 550px;
}

.title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: #4a5568;
  margin-bottom: 2rem;
}

.form-card {
  padding: 2.5rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  text-align: left;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 2rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
  font-size: 0.9rem;
}

.form-control {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  border: 1px solid #cbd5e0;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
}

.btn-submit {
  background-color: #007bff;
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.85rem 1.5rem;
  width: 100%;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 1rem;
}

.btn-submit:hover:enabled {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.btn-submit:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}
</style>
