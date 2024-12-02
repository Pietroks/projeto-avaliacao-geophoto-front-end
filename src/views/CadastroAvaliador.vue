<template>
  <div class="backgroundImg">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="containerCadastro">
            <h1>Faça o seu cadastro</h1>
            <form @submit.prevent="register" class="containerForm">
              <div class="input-group">
                <EnvelopeIcon class="icon" />
                <input v-model="email" type="email" placeholder="Email *" />
                <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
              </div>
              <div class="input-group">
                <input v-model="verificationCode" type="text" placeholder="Código de Verificação *" />
                <div v-if="errors.verificationCode" class="error-message">{{ errors.verificationCode }}</div>
              </div>
              <div class="input-group password-group">
                <LockClosedIcon class="icon" />
                <input
                  v-model="password"
                  @input="updatePasswordStrength"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Senha *"
                />
                <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
                <button
                  type="button"
                  @click="togglePasswordVisibility"
                  :class="{ active: showPassword }"
                  class="show-password-btn"
                >
                  <div v-if="password" :class="passwordStrengthClass" class="password-strength-meter">
                    {{ passwordStrength }}
                  </div>
                  <EyeIcon class="eye-icon" />
                </button>
              </div>
              <div class="input-group">
                <LockClosedIcon class="icon" />
                <input
                  v-model="confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Confirme a Senha *"
                />
                <div v-if="passwordError" class="error-message">As senhas não coincidem.</div>
                <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
              </div>
              <div class="divButton">
                <button type="button" @click="cancel" class="buttonCancelar">Cancelar</button>
                <button type="submit" class="buttonCadastro">Cadastrar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/solid';
  import { EyeIcon } from '@heroicons/vue/24/outline';
  import { API_URL } from '@/config/config';

  export default {
    name: 'CadastroPage',
    components: {
      EnvelopeIcon,
      LockClosedIcon,
      EyeIcon,
    },
    data() {
      return {
        email: '',
        password: '',
        confirmPassword: '',
        verificationCode: '',
        showPassword: false,
        passwordError: false,
        passwordStrength: '',
        passwordStrengthClass: '',
        errors: {
          email: '',
          verificationCode: '',
          password: '',
          confirmPassword: '',
        },
      };
    },
    methods: {
      updatePasswordStrength() {
        if (!this.password) {
          this.passwordStrength = '';
          this.passwordStrengthClass = '';
          return;
        }

        const length = this.password.length;
        if (length < 6) {
          this.passwordStrength = 'Fraca';
          this.passwordStrengthClass = 'strength-weak';
        } else if (length >= 6 && length < 10) {
          this.passwordStrength = 'Média';
          this.passwordStrengthClass = 'strength-medium';
        } else {
          this.passwordStrength = 'Forte';
          this.passwordStrengthClass = 'strength-strong';
        }
      },

      cancel() {
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
        this.verificationCode = '';
        this.passwordStrength = '';
        this.passwordStrengthClass = '';
        this.passwordError = false;
        this.errors = {
          email: '',
          verificationCode: '',
          password: '',
          confirmPassword: '',
        };
      },

      async register() {
        // Limpar erros
        this.errors = {
          email: '',
          verificationCode: '',
          password: '',
          confirmPassword: '',
        };

        // Verificar campos obrigatórios
        let hasError = false;

        if (!this.email) {
          this.errors.email = 'Email é obrigatório.';
          hasError = true;
        }
        if (!this.verificationCode) {
          this.errors.verificationCode = 'Código de verificação é obrigatório.';
          hasError = true;
        }
        if (!this.password) {
          this.errors.password = 'Senha é obrigatória.';
          hasError = true;
        }
        if (this.password !== this.confirmPassword) {
          this.passwordError = true;
          hasError = true;
        } else {
          this.passwordError = false;
        }
        if (!this.confirmPassword) {
          this.errors.confirmPassword = 'Confirme a senha.';
          hasError = true;
        }

        if (hasError) {
          return;
        }

        const jsonData = {
          email: this.email,
          password: this.password,
          verificationCode: this.verificationCode,
        };

        try {
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
            this.$router.push('/');
          } else {
            console.error('Erro na requisição:', response.statusText);
            alert('Erro na requisição: ' + response.statusText);
          }
        } catch (error) {
          console.error('Erro no cadastro:', error);
          alert(`Erro: ${error}`);
        }
      },

      togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
      },
    },
  };
</script>
  
  
<style scoped>
.input-group {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 5px;
  background-color: #fff;
}

.input-group i {
  color: #888;
  margin-right: 0.5rem;
}

.input-group input {
  border: none;
  outline: none;
  flex: 1;
}

.backgroundImg {
  background-image: url('../assets/forest-mist-scenery-2k-wallpaper-uhdpaper.com-844@3@a.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -11.4rem;
}

.containerCadastro {
  background: rgba(255, 255, 255, 0.4);
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
  color: brown;
  font-weight: 100;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
}

.input-group input[type="text"] {
  border: none;
  outline: none;
  flex: 1;
  font-size: 1rem;
  padding: 0.5rem;
} 
.icon {
  width: 24px;
  height: 24px;
  color: #333;
}

input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 1rem;
  padding: 0.5rem;
}

.divButton {
  display: flex;
  gap: 3rem;
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

p {
  font-weight: 500;
}

.link {
  color: brown;
  font-weight: 700;
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

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  margin-right: 1.4rem !important;
}

.input-group input:invalid {
  border-color: red;
}

@media (max-width: 1114px) {
  .containerCadastro[data-v-38d9b80c] {
    width: 75%;
    margin-top: 10rem;
    margin-bottom: 2rem;
  }
}

@media (max-width: 767px) {
  .backgroundImg[data-v-38d9b80c] {
    margin-top: -9.2rem;
    background-position: inherit;
    min-height: 110vh;
  }

  .containerCadastro[data-v-38d9b80c] {
    width: auto;
  }

  .containerForm[data-v-38d9b80c] {
    width: auto;
  }
}
</style>
