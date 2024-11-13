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
                  :class="{'active': showPassword}"
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
                <input v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" placeholder="Confirme a Senha *" />
                <div v-if="passwordError" class="error-message">
                  As senhas não coincidem.
                </div>
              </div>
              <div class="input-group">
                <IdentificationIcon class="icon" />
                <input v-model="cpf" type="text" placeholder="CPF *" @input="applyCpfMask" />
              </div>
              <div class="input-group divComprovante">
                <label><DocumentIcon class="icon" />Apresente um comprovante da sua formação *</label>
                <input type="file" @change="onFileChange" accept=".pdf" class="inputFile" />
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
import { UserIcon, EnvelopeIcon, LockClosedIcon, IdentificationIcon, DocumentIcon } from '@heroicons/vue/24/solid';
import { EyeIcon } from '@heroicons/vue/24/outline';

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
      comprovante: null,
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
    },

    async register() {
      if (this.password !== this.confirmPassword) {
        this.passwordError = true;
        return;
      }
      this.passwordError = false;

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
        };

        const response = await fetch('https://servidor.com.br/api/cadastro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
        });

        if (response.ok) {
          console.log('Usuário cadastrado com sucesso');
          alert('Usuário cadastrado com sucesso');
          this.$router.push('/login');
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

    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.comprovante = file;
      }
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
  background-image: url('../assets/17638-3840x2160-desktop-4k-forest-background.jpg');
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
  background: rgba(255, 255, 255, 0.3);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  margin: 8rem auto 0;
}

h1 {
  color: brown;
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
  padding: 0.5rem;
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
  position: absolute;
  top: 0%;
  left: -210%;
  font-size: 0.8em;
  font-weight: bold;
  margin-top: 0.2rem;
}

.strength-weak {
  color: red;
}

.strength-medium {
  color: orange;
}

.strength-strong {
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

</style>

