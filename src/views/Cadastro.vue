<template>
  <div class="backgroundImg">
    <div class="container">
      <div class="row">
        <div class="col-12">
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
                <div v-if="passwordError" class="error-message">
                  As senhas não coincidem.
                </div>
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
                <MapPinIcon class="icon" />
                <input
                  v-model="cep"
                  type="text"
                  placeholder="CEP *"
                  @input="applyCepMask"
                  @blur="fetchAddressFromCep"
                  maxlength="9"
                  required
                />
              </div>

              <div class="input-group">
                <MapIcon class="icon" />
                <input
                  v-model="rua"
                  type="text"
                  placeholder="Rua/Avenida *"
                  required
                />
              </div>

              <div class="input-group">
                <BuildingLibraryIcon class="icon" />
                <input
                  v-model="bairro"
                  type="text"
                  placeholder="Bairro *"
                  required
                />
              </div>

              <div class="input-group">
                <HomeIcon class="icon" />
                <input
                  v-model="numero"
                  type="text"
                  placeholder="Número *"
                  required
                />
              </div>

              <div class="input-group">
                <select v-model="nivelFormacao" required>
                  <option value="" disabled>
                    Selecione seu nível de formação *
                  </option>
                  <option value= 1>
                    Estudante de Graduação
                  </option>
                  <option value=2>
                    Estudante de Pós-Graduação
                  </option>
                  <option value=3>Graduado</option>
                </select>
              </div>

              <div class="input-group divComprovante">
                <label
                  ><DocumentIcon class="icon" />Anexe o comprovante de formação
                  (PDF) *</label
                >
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
          </div>
        </div>
      </div>
    </div>
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Cadastro Realizado com Sucesso!</h2>
        <p>
          Seu cadastro foi concluído. Clique no botão abaixo para ir à página de
          login.
        </p>
        <button @click="goToLogin" class="buttonLoginRedirect">
          Ir para Login
        </button>
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
  MapPinIcon,
  MapIcon,
  BuildingLibraryIcon,
  HomeIcon
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
    MapPinIcon,
    MapIcon,
    BuildingLibraryIcon,
    HomeIcon
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
      cep: "",
      rua: "",
      bairro: "",
      numero: ""
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
        this.nivelFormacao &&
        this.cep &&
        this.rua &&
        this.bairro &&
        this.numero
      );
    },
  },

  methods: {
    pplyCepMask() {
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
          alert("CEP não encontrado. Por favor, verifique.");
          this.rua = "";
          this.bairro = "";
        } else {
          this.rua = data.logradouro;
          this.bairro = data.bairro;
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        alert("Não foi possível buscar o endereço. Tente novamente.");
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
      this.cep = "";
      this.rua = "";
      this.bairro = "";
      this.numero = "";
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
        formData.append("user_type", "N"); // ou outro valor se tiver um select
        formData.append("category", this.nivelFormacao);
        var endereco_completo= this.rua+this.bairro+this.numero
        formData.append("cep",this.cep.replace(/\D/g, ""))
        formData.append("complete_adress", endereco_completo)
        formData.append("file", this.comprovante);

        const response = await fetch(`${API_URL}/users/`, {
          method: "POST",
          body: formData
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
/* Estilos gerais */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
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
  background: radial-gradient(black, transparent);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  margin: 10rem auto 0;
}

h1 {
  color: ghostwhite;
  font-weight: 100;
}

.containerForm {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 75%;
  margin-top: 2rem;
}

/* Grupo de entrada (input) */
.input-group {
  display: flex;
  align-items: center;
  position: relative;
  border: 1px solid #ccc;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  background-color: #fff;
}

.input-group i,
.icon {
  color: #888;
  margin-right: 0.5rem;
  width: 24px;
  height: 24px;
}

.input-group input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 1rem;
  padding: 0.5rem;
}

/* Botão para mostrar senha */
.show-password-btn {
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  font-size: 1rem;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease;
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

/* Medidor de força de senha */
.password-group {
  position: relative;
}

.password-strength-meter {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 0.8em;
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity 0.3s ease-in-out;
  font-weight: 500;
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

/* Botões de ação */
.buttonCadastro,
.buttonCancelar {
  background-color: #1488f0;
  color: whitesmoke;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 50%;
  margin: 0.5rem auto;
  text-align: center;
}

.buttonCadastro:hover {
  background-color: rgb(26, 0, 173);
}

.buttonCancelar {
  background-color: gray;
}

.buttonCancelar:hover {
  background-color: darkgray;
}

.divComprovante {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.divComprovante label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.inputFile {
  font-size: 0.9rem;
  cursor: pointer;
}

.error-message {
  color: red;
  font-size: 0.75em;
  font-weight: bold;
  border-radius: 5px;
  margin-top: 0.3rem;
}

.divButton {
  display: flex;
  gap: 1rem;
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
}
.buttonLoginRedirect {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.buttonCadastro:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

select {
  border: none;
  outline: none;
  padding: 0.5rem;
  flex: 1;
  font-size: 1rem;
  background-color: transparent;
}

.input-group input:invalid {
  border-color: red;
}
.error-message {
  color: red;
  font-size: 0.8rem;
  width: 100%;
}

@media (max-width: 1366px) {
  .containerCadastro[data-v-c39bac1a] {
    width: 65%;
  }
}

@media (max-width: 1114px) {
  .containerCadastro[data-v-c39bac1a] {
    width: 90%;
  }
}

@media (max-width: 767px) {
  .backgroundImg[data-v-c39bac1a] {
    background-position: inherit;
    background-repeat: repeat-y;
    min-height: 110vh;
  }

  .containerCadastro[data-v-c39bac1a] {
    padding: 0.5rem;
    width: auto;
    margin-bottom: 2rem;
  }

  .containerForm[data-v-c39bac1a] {
    width: 95%;
  }

  .input-group input[data-v-c39bac1a] {
    font-size: 0.7rem;
  }
}
</style>
