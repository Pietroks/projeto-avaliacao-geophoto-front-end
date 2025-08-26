<template>
  <div class="cadastro-background">
    <div class="cadastro-container">
      <h1 class="titulo">Faça o seu cadastro</h1>
      <form @submit.prevent="register" class="form-container">
        <fieldset class="form-section">
          <div class="input-group mb-3">
            <span class="input-group-text"><UserIcon class="icon" /></span>
            <input v-model.trim="name" type="text" class="form-control" placeholder="Nome Completo *" required />
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text"><EnvelopeIcon class="icon" /></span>
            <input v-model.trim="email" type="email" class="form-control" placeholder="Email *" required />
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text"><IdentificationIcon class="icon" /></span>
            <input v-model="cpf" type="text" class="form-control" placeholder="CPF *" @input="applyCpfMask" @blur="validateCpf" required />
          </div>
          <div v-if="cpfError" class="error-message">CPF inválido.</div>
        </fieldset>

        <fieldset class="form-section">
          <div class="input-group mb-3">
            <span class="input-group-text"><LockClosedIcon class="icon" /></span>
            <input
              v-model="password"
              @input="updatePasswordStrength"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Senha *"
              required
            />
            <span :class="passwordStrengthClass" class="password-strength-meter">{{ passwordStrength }}</span>
            <button type="button" @click="togglePasswordVisibility" class="btn btn-outline-secondary eye-button">
              <EyeIcon v-if="!showPassword" class="eye-icon" />
              <EyeSlashIcon v-else class="eye-icon" />
            </button>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text"><LockClosedIcon class="icon" /></span>
            <input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Confirme a Senha *"
              required
            />
          </div>
          <div v-if="passwordError" class="error-message">As senhas não coincidem.</div>
        </fieldset>

        <fieldset class="form-section">
          <div class="input-group mb-3">
            <span class="input-group-text"><MapPinIcon class="icon" /></span>
            <input
              v-model="cep"
              type="text"
              class="form-control"
              placeholder="CEP *"
              @input="applyCepMask"
              @blur="fetchAddressFromCep"
              maxlength="9"
              required
            />
          </div>
          <div class="row">
            <div class="col-md-9 mb-3">
              <div class="input-group">
                <span class="input-group-text"><MapIcon class="icon" /></span>
                <input v-model="rua" type="text" class="form-control" placeholder="Rua/Avenida *" required />
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="input-group">
                <span class="input-group-text"><HomeIcon class="icon" /></span>
                <input v-model="numero" type="text" class="form-control" placeholder="Nº *" required />
              </div>
            </div>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text"><BuildingLibraryIcon class="icon" /></span>
            <input v-model="bairro" type="text" class="form-control" placeholder="Bairro *" required />
          </div>
        </fieldset>

        <fieldset class="form-section">
          <select v-model="nivelFormacao" class="form-select mb-3" required>
            <option value="" disabled>Selecione seu nível de formação *</option>
            <option value="1">Estudante de Graduação</option>
            <option value="2">Estudante de Pós-Graduação</option>
            <option value="3">Graduado</option>
          </select>

          <div class="input-group mb-3">
            <span class="input-group-text"><BuildingOffice2Icon class="icon" /></span>
            <input v-model.trim="instituicao" type="text" class="form-control" placeholder="Nome da Instituição *" required />
          </div>

          <label for="comprovante" class="form-label label-comprovante"
            ><DocumentIcon class="icon" /> Anexe o comprovante de formação (PDF) *</label
          >
          <input type="file" id="comprovante" @change="onFileChange" accept=".pdf" class="form-control" required />
        </fieldset>

        <div class="d-grid gap-2 mt-4">
          <button type="submit" :disabled="!isFormValid || isLoading" class="button-cadastro">
            {{ isLoading ? "Cadastrando..." : "Cadastrar" }}
          </button>
          <button type="button" @click="cancel" class="button-cancelar">Cancelar</button>
        </div>
      </form>
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
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  IdentificationIcon,
  DocumentIcon,
  MapPinIcon,
  MapIcon,
  BuildingLibraryIcon,
  HomeIcon,
  BuildingOffice2Icon,
} from "@heroicons/vue/24/solid";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { API_URL } from "@/config/config.js";
import Footer from "@/components/Footer.vue";
import Modal from "@/components/Modal.vue";

export default {
  name: "CadastroPage",
  components: {
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
    IdentificationIcon,
    DocumentIcon,
    EyeIcon,
    EyeSlashIcon,
    MapPinIcon,
    MapIcon,
    BuildingLibraryIcon,
    HomeIcon,
    BuildingOffice2Icon,
    Footer,
    Modal,
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
      instituicao: "",
      comprovante: null,
      showPassword: false,
      passwordError: false,
      passwordStrength: "",
      passwordStrengthClass: "",
      isLoading: false,
      cep: "",
      rua: "",
      bairro: "",
      numero: "",
      isModalVisible: false,
      modal: {
        title: "",
        message: "",
        buttonText: "",
        type: "info",
        action: null,
      },
    };
  },

  computed: {
    isFormValid() {
      const passwordsMatch = this.password && this.password === this.confirmPassword;
      return (
        this.name &&
        this.email &&
        passwordsMatch &&
        this.cpf &&
        !this.cpfError &&
        this.nivelFormacao &&
        this.instituicao &&
        this.comprovante &&
        this.cep &&
        this.rua &&
        this.bairro &&
        this.numero
      );
    },
  },

  watch: {
    // Sempre que a senha principal mudar, chame a validação
    password() {
      this.validatePasswordMatch();
    },
    // Sempre que a confirmação de senha mudar, chame a validação também
    confirmPassword() {
      this.validatePasswordMatch();
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

    applyCepMask() {
      this.cep = this.cep
        .replace(/\D/g, "")
        .replace(/^(\d{5})(\d)/, "$1-$2")
        .slice(0, 9);
    },

    async fetchAddressFromCep() {
      const cep = this.cep.replace(/\D/g, "");
      if (cep.length !== 8) {
        return;
      }
      this.isLoading = true;
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
          this.showAlert("Erro no CEP", "O CEP informado não foi encontrado. Por favor, verifique.", "error");
          this.rua = "";
          this.bairro = "";
        } else {
          this.rua = data.logradouro;
          this.bairro = data.bairro;
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        this.showAlert("Erro de Rede", "Não foi possível buscar o endereço. Tente novamente.", "error");
      } finally {
        this.isLoading = false;
      }
    },
    updatePasswordStrength() {
      if (!this.password) {
        this.passwordStrength = "";
        this.passwordStrengthClass = "";
        return;
      }

      const strength = this.password.length >= 10 ? "Forte" : this.password.length >= 6 ? "Média" : "Fraca";

      this.passwordStrength = strength;
      this.passwordStrengthClass = `strength-${strength.toLowerCase()}`;
    },

    validatePasswordMatch() {
      if (this.confirmPassword && this.password !== this.confirmPassword) {
        this.passwordError = true;
      } else {
        this.passwordError = false;
      }
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
      this.instituicao = "";
      this.cpfError = false;
      this.cep = "";
      this.rua = "";
      this.bairro = "";
      this.numero = "";
    },

    async register() {
      if (!this.isFormValid) {
        this.showAlert("Formulário Incompleto", "Por favor, preencha todos os campos obrigatórios.", "error");
        return;
      }
      this.isLoading = true;

      try {
        const formData = new FormData();
        formData.append("name", this.name);
        formData.append("email", this.email);
        formData.append("password", this.password);
        formData.append("document", this.cpf.replace(/\D/g, ""));
        formData.append("user_type", "N");
        formData.append("category", this.nivelFormacao);
        formData.append("institution", this.instituicao);
        var endereco_completo = `${this.rua}, ${this.numero}, ${this.bairro}`;
        formData.append("cep", this.cep.replace(/\D/g, ""));
        formData.append("complete_address", endereco_completo);
        formData.append("file", this.comprovante);

        const response = await fetch(`${API_URL}/users/`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          this.showAlert(
            "Cadastro Realizado!",
            "Seu cadastro foi concluído. Clique no botão abaixo para ir à página de login.",
            "success",
            "Ir para Login",
            () => this.$router.push("/login")
          );
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao realizar o cadastro.");
        }
      } catch (error) {
        console.error("Erro no cadastro:", error);
        this.showAlert("Erro no Cadastro", error.message, "error");
      } finally {
        this.isLoading = false;
      }
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    onFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        this.comprovante = file;
      } else {
        this.showAlert("Arquivo Inválido", "Por favor, envie um arquivo no formato PDF.", "error");
        event.target.value = "";
        this.comprovante = null;
      }
    },
  },
};
</script>

<style scoped>
.cadastro-background {
  background: url("../assets/hex5.webp") no-repeat center center;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
}

.cadastro-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  max-width: 600px;
  width: 100%;
}

.form-container {
  width: 100%;
  margin-top: 1.5rem;
}

.form-section {
  border: none;
  padding: 0;
  margin-bottom: 1.5rem;
}

.titulo {
  color: black;
  font-weight: 300;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
}

.input-group-text,
.form-control,
.form-select {
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-bottom: 1px solid gray;
  color: black;
  font-size: 1rem;
}

.form-control::placeholder,
.form-select {
  color: gray;
}
.form-select option {
  color: grey;
}

.form-control:focus,
.form-select:focus {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: #1488f0;
  box-shadow: 0 0 0 0.25rem rgba(20, 136, 240, 0.25);
  color: black;
}

.icon {
  width: 24px;
  height: 24px;
  color: black;
}

/* Estilo para o botão de ver senha */
.eye-button {
  border-color: rgba(255, 255, 255, 0.3);
}
.eye-icon {
  width: 20px;
  height: 20px;
  color: black;
}

/* Medidor de força da senha */
.password-strength-meter {
  font-size: 0.8em;
  font-weight: 500;
  padding: 0 0.75rem;
  white-space: nowrap;
}
.strength-fraca {
  color: #dd0606;
}
.strength-média {
  color: #df8805;
}
.strength-forte {
  color: #05ee05;
}

/* Upload de arquivo */
.label-comprovante {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: grey;
  margin-bottom: 0.5rem;
}

/* Mensagens de erro */
.error-message {
  color: #e60808;
  font-size: 0.875rem;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  width: 100%;
}

/* Botões */
.button-cadastro,
.button-cancelar {
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  font-size: 1.1rem;
  font-weight: 600;
}

.button-cadastro {
  background-color: #1488f0;
}
.button-cancelar {
  background-color: #6c757d;
}

.button-cadastro:hover:not(:disabled) {
  background-color: #106ac0;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(20, 136, 240, 0.3);
}
.button-cancelar:hover {
  background-color: #5a6268;
}

.button-cadastro:disabled {
  background-color: #555;
  cursor: not-allowed;
}

@media (max-width: 767px) {
  .cadastro-background {
    align-items: flex-start;
    padding-top: 2rem;
  }
  .titulo {
    font-size: 1.7rem;
  }

  .form-control {
    font-size: 0.8rem;
  }

  #comprovante {
    font-size: 0.6rem;
  }
}
</style>
