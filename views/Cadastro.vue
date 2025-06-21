<template>
  <div class="backgroundImg">
    <div class="containerCadastro">
      <h1>Faça o seu cadastro</h1>
      <form @submit.prevent="register" class="containerForm">
        <div class="input-group">
          <UserIcon class="icon" />
          <input
            v-model.trim="name"
            type="text"
            placeholder="Nome *"
            required
          />
        </div>

        <div class="input-group">
          <EnvelopeIcon class="icon" />
          <input
            v-model.trim="email"
            type="email"
            placeholder="Email *"
            required
          />
        </div>

        <div class="input-group password-group">
          <LockClosedIcon class="icon" />
          <input
            v-model="password"
            @input="updatePasswordStrength"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Senha *"
            required
          />
          <button
            type="button"
            @click="togglePasswordVisibility"
            :class="{ active: showPassword }"
            class="show-password-btn"
          >
            <EyeIcon class="eye-icon" />
          </button>
          <div
            v-if="password"
            :class="passwordStrengthClass"
            class="password-strength-meter"
          >
            Força: {{ passwordStrength }}
          </div>
        </div>

        <div class="input-group">
          <LockClosedIcon class="icon" />
          <input
            v-model="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Confirme a Senha *"
            required
          />
        </div>
        <div v-if="passwordError" class="error-message">
          As senhas não coincidem.
        </div>

        <div class="input-group">
          <IdentificationIcon class="icon" />
          <input
            v-model="cpf"
            type="text"
            placeholder="CPF *"
            @input="applyCpfMask"
            @blur="validateCpf"
            required
          />
        </div>
        <div v-if="cpfError" class="error-message">
          CPF inválido. Verifique e tente novamente.
        </div>

        <div class="input-group">
          <select v-model="nivelFormacao" required>
            <option value="" disabled>Selecione seu nível de formação *</option>
            <option value="1">Estudante de Graduação</option>
            <option value="2">Estudante de Pós-Graduação</option>
            <option value="3">Graduado</option>
          </select>
        </div>

        <div class="input-group divComprovante">
          <label>
            <DocumentIcon class="icon" />Anexe o comprovante de formação (PDF) *
          </label>
          <input
            type="file"
            @change="onFileChange"
            accept=".pdf"
            class="inputFile"
            required
          />
        </div>

        <div class="divButton">
          <button type="button" @click="cancel" class="buttonCancelar">
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="buttonCadastro"
          >
            {{ isLoading ? "Cadastrando..." : "Cadastrar" }}
          </button>
        </div>
      </form>

      <div v-if="showSuccessModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Cadastro Realizado com Sucesso!</h2>
          <p>
            Seu cadastro foi concluído. Clique no botão abaixo para ir à página
            de login.
          </p>
          <button @click="goToLogin" class="buttonLoginRedirect">
            Ir para Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  IdentificationIcon,
  DocumentIcon,
} from "@heroicons/vue/24/solid";
import { EyeIcon } from "@heroicons/vue/24/outline";
import { API_URL } from "@/config/config.js";

export default {
  name: "CadastroPage",
  components: {
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
    IdentificationIcon,
    DocumentIcon,
    EyeIcon,
  },
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      cpf: "",
      cpfError: false,
      nivelFormacao: "",
      comprovante: null,
      showPassword: false,
      passwordError: false,
      passwordStrength: "",
      passwordStrengthClass: "",
      showSuccessModal: false,
      isLoading: false,
    };
  },

  computed: {
    isFormValid() {
      const passwordsMatch =
        this.password && this.password === this.confirmPassword;
      return (
        this.name &&
        this.email &&
        passwordsMatch &&
        this.confirmPassword &&
        this.password === this.confirmPassword &&
        this.cpf &&
        !this.cpfError &&
        this.comprovante &&
        this.nivelFormacao
      );
    },
  },

  methods: {
    updatePasswordStrength() {
      if (!this.password) {
        this.passwordStrength = "";
        this.passwordStrengthClass = "";
        return;
      }

      const strength =
        this.password.length >= 10
          ? "Forte"
          : this.password.length >= 6
          ? "Média"
          : "Fraca";

      this.passwordStrength = strength;
      this.passwordStrengthClass = `strength-${strength.toLowerCase()}`;
    },

    validateCpf() {
      const cpf = this.cpf.replace(/\D/g, "");
      if (cpf.length !== 11 || /^(\d)\1*$/.test(cpf)) {
        this.cpfError = true;
        return false;
      }

      let sum = 0,
        remainder;

      for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.substring(9, 10))) {
        this.cpfError = true;
        return false;
      }

      sum = 0;
      for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.substring(10, 11))) {
        this.cpfError = true;
        return false;
      }

      this.cpfError = false;
      return true;
    },

    applyCpfMask() {
      this.cpf = this.cpf
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    },

    cancel() {
      this.name = "";
      this.email = "";
      this.password = "";
      this.confirmPassword = "";
      this.cpf = "";
      this.comprovante = null;
      this.passwordStrength = "";
      this.passwordStrengthClass = "";
      this.passwordError = false;
      this.nivelFormacao = "";
      this.cpfError = false;
    },

    async register() {
      if (!this.isFormValid) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
      }
      this.isLoading = true;

      try {
        const formData = new FormData();
        formData.append("name", this.name);
        formData.append("email", this.email);
        formData.append("password", this.password);
        formData.append("document", this.cpf.replace(/\D/g, ""));
        formData.append("category", this.nivelFormacao);
        formData.append("user_type", "user");
        formData.append("file", this.comprovante);

        const response = await fetch(`${API_URL}/users/`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          this.showSuccessModal = true;
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao realizar o cadastro.");
        }
      } catch (error) {
        console.error("Erro no cadastro:", error);
        alert(`Erro: ${error.message}`);
      } finally {
        this.isLoading = false;
      }
    },

    goToLogin() {
      this.showSuccessModal = false;
      this.$router.push("/login");
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    onFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        this.comprovante = file;
      } else {
        alert("Por favor, envie um arquivo PDF válido.");
        event.target.value = "";
        this.comprovante = null;
      }
    },

    closeModal() {
      this.showSuccessModal = false;
    },
  },
};
</script>

<style scoped>
.backgroundImg {
  background: linear-gradient(to top, #010020, #1b013d, #2e014f, #3d025e);
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -11.4rem;
}

.containerCadastro {
  background: radial-gradient(black, transparent);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: auto;
  margin-top: 14rem;
  margin-bottom: 3rem;
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

.input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
  background-color: transparent;
  border-radius: 5px;
  padding: 0.5rem;
  color: #ccc;
}

.icon {
  width: 24px;
  height: 24px;
  color: #333;
}

input,
select {
  border: none;
  outline: none;
  width: 100%;
  font-size: 1rem;
  padding: 0.5rem;
  background-color: transparent;
  color: #ccc;
}

.inputFile {
  font-size: 0.9rem;
  cursor: pointer;
  background-color: gray;
  padding: 0.5rem;
  border-radius: 5px;
  width: 100%;
}

.buttonCadastro,
.buttonCancelar {
  background-color: brown;
  color: whitesmoke;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 50%;
  margin: 0 auto;
}

.buttonCadastro:hover {
  background-color: darkred;
}

.buttonCancelar {
  background-color: gray;
  margin-bottom: 0;
}

.buttonCancelar:hover {
  background-color: darkgray;
}

.show-password-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 1.5em;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity 0.3s ease-in-out;
}

.show-password-btn.active {
  color: green;
  transform: translateY(-50%) scale(1.1);
}

.eye-icon {
  width: 20px;
  height: 20px;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.show-password-btn:hover .eye-icon {
  opacity: 0.5;
}

.password-strength-meter {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  font-weight: bold;
}

.strength-fraca {
  color: red;
}

.strength-média {
  color: orange;
}

.strength-forte {
  color: green;
}

.error-message {
  color: red;
  font-size: 0.8rem;
  width: 100%;
  margin-top: -1rem;
  padding-left: 0.5rem;
}

.divButton {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.buttonLoginRedirect {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.buttonCadastro:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
    width: auto;
    margin-top: auto;
  }
}
</style>
