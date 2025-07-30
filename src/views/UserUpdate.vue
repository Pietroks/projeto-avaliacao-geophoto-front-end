<template>
  <div class="backgroundImg">
    <div class="container">
      <div class="containerCadastro">
        <h1>Atualize sua Senha</h1>
        <form @submit.prevent="handleUpdatePassword" class="containerForm">
          <div class="input-group">
            <LockClosedIcon class="icon" />
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Nova Senha"
              required
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="show-password-btn"
            >
              <EyeIcon class="eye-icon" />
            </button>
          </div>

          <div class="input-group">
            <LockClosedIcon class="icon" />
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirme a Senha"
              required
            />
            <button
              type="button"
              @click="toggleConfirmPasswordVisibility"
              class="show-password-btn"
            >
              <EyeIcon class="eye-icon" />
            </button>
          </div>

          <button :disabled="isLoading" type="submit" class="buttonCadastro">
            {{ isLoading ? "Atualizando..." : "Atualizar Senha" }}
          </button>
        </form>

        <p v-if="message" :class="messageType">{{ message }}</p>

        <p>
          Lembrou a senha?
          <router-link to="/login" class="link">Voltar para o Login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { LockClosedIcon } from "@heroicons/vue/24/solid";
import { EyeIcon } from "@heroicons/vue/24/outline";
import { API_URL } from "@/config/config";

export default {
  name: "UpdatePasswordPage",
  components: {
    LockClosedIcon,
    EyeIcon,
  },
  data() {
    return {
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      message: "",
      messageType: "", // 'success-message' ou 'error-message'
    };
  },
  computed: {
    token() {
      // Pega o token do Vuex (ou de onde estiver armazenado)
      return this.$store.getters["user/token"];
    },
  },
  methods: {
    async handleUpdatePassword() {
      if (this.password.trim() !== this.confirmPassword.trim()) {
        this.message = "As senhas não coincidem.";
        this.messageType = "error-message";
        return;
      }

      this.isLoading = true;
      this.message = "";
      this.messageType = "";
      const usuarioId = this.$route.params.id;

      try {
        const response = await fetch(`${API_URL}/users/${usuarioId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({ 
            password: this.password
           }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || "Erro ao atualizar a senha.");
        }

        this.message = "Senha atualizada com sucesso!";
        this.messageType = "success-message";
        this.password = "";
        this.confirmPassword = "";
      } catch (error) {
        this.message = error.message;
        this.messageType = "error-message";
      } finally {
        this.isLoading = false;
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
  },
};
</script>

<style scoped>
.input-group {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 5px;
  background-color: #fff;
}

.input-group input {
  border: none;
  outline: none;
  flex: 1;
  padding-right: 40px; /* Espaço para o ícone do olho */
}

.backgroundImg {
  background: linear-gradient(to top, #2c313c, #3c4454, #3c4454, #2c313c);
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -11.4rem;
}

.containerCadastro {
  background: radial-gradient(#bbbbbb, transparent);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  margin: 0 auto;
  margin-top: 8rem;
}

.containerForm {
  display: flex;
  gap: 1.5rem;
  flex-direction: column;
  margin-top: 2rem;
  width: 75%;
}

h1 {
  color: ghostwhite;
  font-weight: 100;
}

.icon {
  width: 24px;
  height: 24px;
  color: #333;
  margin-right: 0.5rem;
}

input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 1rem;
  padding: 0.5rem;
  background: transparent;
}

.buttonCadastro {
  background-color: #1488f0;
  color: whitesmoke;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 50%;
  margin: 0 auto;
  margin-bottom: 2rem;
}

p {
  font-weight: 500;
  color: gainsboro;
}

.link {
  color: #1488f0;
  font-weight: 700;
}

.show-password-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.eye-icon {
  width: 20px;
  height: 20px;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  color: #333;
}

.show-password-btn:hover .eye-icon {
  opacity: 0.5;
}

.error-message {
  color: #ff4d4d; /* Vermelho mais forte */
  font-weight: bold;
}

.success-message {
  color: #4dff4d; /* Verde mais forte */
  font-weight: bold;
}

@media (max-width: 1114px) {
  .containerCadastro {
    width: 75%;
  }
}

@media (max-width: 767px) {
  .backgroundImg {
    margin-top: -9.2rem;
    background-position: inherit;
    min-height: 110vh;
  }

  .containerCadastro {
    padding: 0.5rem;
    width: 90%;
    margin-top: 5rem;
  }
}
</style>