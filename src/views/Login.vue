<template>
  <div class="login-background">
    <div class="login-container">
      <h1 class="titulo">Faça o seu login</h1>
      <form @submit.prevent="handleLogin" class="form-container">
        <div class="input-group mb-3">
          <span class="input-group-text">
            <EnvelopeIcon class="icon" />
          </span>
          <input v-model="email" type="email" class="form-control" placeholder="Email" required />
        </div>

        <div class="input-group mb-3">
          <span class="input-group-text">
            <LockClosedIcon class="icon" />
          </span>
          <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-control" placeholder="Senha" required />
          <button type="button" @click="togglePasswordVisibility" class="btn btn-outline-secondary eye-button">
            <EyeIcon v-if="!showPassword" class="eye-icon" />
            <EyeSlashIcon v-else class="eye-icon" />
          </button>
        </div>

        <button :disabled="isLoading" type="submit" class="button-login">
          {{ isLoading ? "Entrando..." : "Entrar" }}
        </button>
      </form>

      <p class="mt-4 link-cadastro">
        Não tem uma conta?
        <router-link to="/cadastro" class="link">Cadastre-se</router-link>
      </p>
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

  <Footer />
</template>

<script>
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/solid";
import { mapActions, mapGetters } from "vuex";
import Footer from "@/components/Footer.vue";
import Modal from "@/components/Modal.vue";

export default {
  name: "LoginPage",
  components: {
    EnvelopeIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    Footer,
    Modal,
  },
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      isLoading: false,
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
    ...mapGetters("user", ["isAuthenticated"]),
  },
  methods: {
    ...mapActions("user", ["login"]),

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

    async handleLogin() {
      this.isLoading = true;
      try {
        await this.login({ email: this.email, password: this.password });
        this.$router.push("/dashboard");
      } catch (error) {
        this.showAlert("Erro no Login", error.message || "Email ou senha inválidos. Por favor, tente novamente.", "error");
      } finally {
        this.isLoading = false;
      }
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
  mounted() {
    if (this.isAuthenticated) {
      this.$router.push("/");
    }
  },
};
</script>

<style scoped>
.login-background {
  background: url("../assets/hex4.webp") no-repeat center center;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.login-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 450px;
  width: 100%;
  margin-top: -5rem;
}

.form-container {
  width: 100%;
  margin-top: 2rem;
}

.titulo {
  color: black;
  font-weight: 300;
  font-size: 2.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.input-group-text {
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: black;
}

.icon {
  width: 24px;
  height: 24px;
  color: black;
}

.form-control {
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-bottom: 1px solid gray;
  color: black;
  font-size: 1rem;
  padding: 0.75rem 1rem;
}

.form-control::placeholder {
  color: gray;
}

.form-control:focus {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: #1488f0;
  box-shadow: 0 0 0 0.25rem rgba(20, 136, 240, 0.25);
  color: black;
}

.eye-button {
  border-color: rgba(238, 6, 6, 0.3);
}
.eye-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.eye-icon {
  width: 20px;
  height: 20px;
  color: black;
}

.button-login {
  background-color: #1488f0;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 1rem;
}

.button-login:hover:not(:disabled) {
  background-color: #106ac0;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(20, 136, 240, 0.3);
}

.button-login:disabled {
  background-color: #555;
  cursor: not-allowed;
}

.link-cadastro {
  font-weight: 400;
  color: gray;
}

.link {
  color: #106ac0;
  font-weight: 600;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.error-message {
  color: #ffcccc;
  background-color: rgba(255, 0, 0, 0.2);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  width: 100%;
  text-align: center;
}

@media (max-width: 767px) {
  .login-container {
    margin-top: 0rem;
  }

  .login-background {
    align-items: flex-start;
    padding-top: 4rem;
  }
  .titulo {
    font-size: 1.7rem;
  }
}
</style>
