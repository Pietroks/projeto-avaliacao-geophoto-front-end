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
                  <div v-if="passwordError" class="error-message">
                    As senhas não coincidem.
                  </div>
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
        showPassword: false,
        passwordError: false,
        passwordStrength: '',
        passwordStrengthClass: ''
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
        this.passwordStrength = '';
        this.passwordStrengthClass = '';
        this.passwordError = false;
      },
  
      async register() {
        if (this.password !== this.confirmPassword) {
          this.passwordError = true;
          return;
        }
        this.passwordError = false;
  
        const jsonData = {
          email: this.email,
          password: this.password,
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
      }
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
  
    .buttonCadastro {
      background-color: brown;
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
  
    .buttonCadastro:hover {
      background-color: darkred;
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
  </style>
  