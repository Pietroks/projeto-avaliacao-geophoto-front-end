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
                <input v-model="name" type="text" placeholder="Nome *" />
              </div>
              <div class="input-group">
                <EnvelopeIcon class="icon" />
                <input v-model="email" type="email" placeholder="Email *" />
              </div>
              <div class="input-group password-group">
                <LockClosedIcon class="icon" />
                <input
                  v-model="password"
                  @input="updatePasswordStrength"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Senha *"
                />
                <button
                  type="button"
                  @click="togglePasswordVisibility"
                  :class="{ 'active': showPassword }"
                  class="show-password-btn"
                >
                  <EyeIcon class="eye-icon" />
                </button>
                <!-- Medidor de força de senha -->
                <div v-if="password" :class="passwordStrengthClass" class="password-strength-meter">
                  {{ passwordStrength }}
                </div>
              </div>
              <div class="input-group">
                <LockClosedIcon class="icon" />
                <input
                  v-model="confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Confirme a Senha *"
                />
                <div v-if="passwordError" class="error-message">
                  As senhas não coincidem.
                </div>
              </div>
              <div class="input-group">
                <IdentificationIcon class="icon" />
                <input v-model="cpf" type="text" placeholder="CPF *" @input="applyCpfMask" />
                <div v-if="cpfError" class="error-message">
                  CPF inválido. Verifique e tente novamente.
                </div>
              </div>
              <div class="input-group">
                <select v-model="nivelFormacao" required>
                  <option value="" disabled selected>Selecione seu nível de formação</option>
                  <option value="estudanteGraduacao">Estudante de Graduação</option>
                  <option value="estudantePosGraduacao">Estudante de Pós-Graduação</option>
                  <option value="graduado">Graduado</option>
                </select>
              </div>
              <div class="input-group divComprovante">
                <label><DocumentIcon class="icon" />Apresente um comprovante da sua formação *</label>
                <input type="file" @change="onFileChange" accept=".pdf" class="inputFile" />
              </div>
              <div class="divButton">
                <button type="button" @click="cancel" class="buttonCancelar">Cancelar</button>
                <button type="submit" :disabled="!isFormValid" class="buttonCadastro">Cadastrar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Cadastro Realizado com Sucesso!</h2>
        <p>Seu cadastro foi concluído. Clique no botão abaixo para ir à página de login.</p>
        <button @click="goToLogin" class="buttonLoginRedirect">Ir para Login</button>
        <button @click="closeModal" class="buttonCloseModal">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { UserIcon, EnvelopeIcon, LockClosedIcon, IdentificationIcon, DocumentIcon } from '@heroicons/vue/24/solid';
import { EyeIcon } from '@heroicons/vue/24/outline';
import { API_URL } from '@/config/config.js';

export default {
  name: 'CadastroPage',
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
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      cpf: '',
      cpfError: false,
      nivelFormacao: '',
      comprovante: null,
      showPassword: false,
      passwordError: false,
      passwordStrength: '',
      passwordStrengthClass: '',
      showSuccessModal: false,
    };
  },

  computed: {
    isFormValid() {
      return (
        this.name &&
        this.email &&
        this.password &&
        this.confirmPassword &&
        this.password === this.confirmPassword &&
        this.cpf &&
        !this.cpfError &&
        this.comprovante !== null && 
        this.nivelFormacao
      );
    },
  },

  methods: {
    updatePasswordStrength() {
      console.log("Password input changed:", this.password);
      if (!this.password) {
        this.passwordStrength = '';
        this.passwordStrengthClass = '';
        return;
      }

      const strength = this.password.length >= 10 
        ? 'Forte' 
        : this.password.length >= 6 
        ? 'Média' 
        : 'Fraca';

      this.passwordStrength = strength;
      this.passwordStrengthClass = `strength-${strength.toLowerCase()}`;
    },


    validateCpf() {
      const cpf = this.cpf.replace(/\D/g, '');
      if (cpf.length !== 11 || /^(\d)\1*$/.test(cpf)) {
        this.cpfError = true;
        return false;
      }

      let sum = 0, remainder;

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
      this.cpf = this.cpf.replace(/\D/g, '') 
        .replace(/(\d{3})(\d)/, '$1.$2')     
        .replace(/(\d{3})(\d)/, '$1.$2')     
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 
    },

    cancel() {
      this.name = '';
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
      this.cpf = '';
      this.comprovante = null;
      this.passwordStrength = '';
      this.passwordStrengthClass = '';
      this.passwordError = false;
      this.nivelFormacao = '';
      this.cpfError = false;
    },

    async register() {
      if (this.password !== this.confirmPassword) {
        this.passwordError = true;
        return;
      }
      this.passwordError = false;

      if (!this.validateCpf()) {
        alert('Por favor, insira um CPF válido.');
        return;
      }

      if (!this.comprovante) {
        alert('Por favor, envie um comprovante da sua formação.');
        return;
      }

      const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject('Erro ao converter o arquivo.');
        });
      };

      try {
        const comprovanteBase64 = await convertFileToBase64(this.comprovante);
        const jsonData = {
          name: this.name,
          email: this.email,
          password: this.password,
          cpf: this.cpf,
          comprovante: comprovanteBase64,
          nivelFormacao: this.nivelFormacao, 
        };

        const response = await fetch(`${API_URL}/cadastro`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
        });

        if (response.ok) {
          console.log('Usuário cadastrado com sucesso');
          alert('Usuário cadastrado com sucesso');
          this.showSuccessModal = true; 
        } else {
          console.error('Erro na requisição:', response.statusText);
          alert('Erro na requisição: ' + response.statusText);
        }
      } catch (error) {
        console.error('Erro no cadastro:', error);
        alert(`Erro: ${error}`);
      }
    },

    goToLogin() {
      this.showSuccessModal = false;
      this.$router.push('/login');
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    onFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        this.comprovante = file;
      } else {
        alert('Por favor, envie um arquivo PDF válido.');
        this.comprovante = null;
      }
    },

    closeModal() {
      this.showSuccessModal = false;
    }
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
  background-color: brown;
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
  background-color: darkred;
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
  background-color: #4CAF50;
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

