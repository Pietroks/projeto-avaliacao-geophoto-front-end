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
                <input v-model="name" type="text" placeholder="Nome" />
              </div>
              <div class="input-group">
                <EnvelopeIcon class="icon" />
                <input v-model="email" type="email" placeholder="Email" />
              </div>
              <div class="input-group">
                <LockClosedIcon class="icon" />
                <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Senha" />
                <button type="button" @click="togglePasswordVisibility" class="show-password-btn">
                  <!-- Ícones de olho aberto e fechado alternando corretamente -->
                  <EyeIcon v-if="!showPassword" class="eye-icon" />
                  <EyeOffIcon v-if="showPassword" class="eye-off-icon" />
                </button>
              </div>
              <div class="input-group">
                <IdentificationIcon class="icon" />
                <input v-model="cpf" type="text" placeholder="CPF" />
              </div>
              <div class="input-group">
                <DocumentIcon class="icon" />
                <label>Apresente um comprovante da sua formação</label>
                <input type="file" @change="onFileChange" accept=".pdf, .jpg, .jpeg, .png" />
              </div>
              <button type="submit" class="buttonCadastro">Cadastrar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UserIcon, EnvelopeIcon, LockClosedIcon, IdentificationIcon, DocumentIcon } from '@heroicons/vue/24/solid';
import { EyeIcon, EyeOffIcon } from '@heroicons/vue/24/outline'; // Importando os ícones de olho

export default {
  name: 'CadastroPage',
  components: {
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
    IdentificationIcon,
    DocumentIcon,
    EyeIcon,     // Ícone de olho aberto
    EyeOffIcon,  // Ícone de olho fechado
  },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      cpf: '',
      comprovante: null,
      showPassword: false, // Variável para controlar a visibilidade da senha
    };
  },
  methods: {
    async register() {
      if (!this.comprovante) {
        alert('Por favor, envie um comprovante da sua formação.');
        return;
      }

      // incluir as informações no data //
      const formData = new FormData();

      formData.append('name', this.name);
      formData.append('email', this.email);
      formData.append('password', this.password);
      formData.append('cpf', this.cpf);
      formData.append('comprovante', this.comprovante);

      try {
        const response = await fetch('https://servidor.com.br/api/cadastro', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          console.log('Usuário cadastrado com sucesso');
          this.$route.push('/login');
        } else {
          console.log('Erro na requisição', response.statusText);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
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
    margin: 0 auto;
    margin-top: 8rem;
  }

  .containerForm {
    display: flex;
    gap: 1.5rem;
    flex-direction: column;
    margin-top: 2rem;
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
  }

  .buttonCadastro:hover {
    background-color: darkred;
  }

  .show-password-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-size: 1.5em; /* Tamanho do ícone */
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }

  .eye-icon, .eye-off-icon {
    width: 20px; /* Ajuste o tamanho do ícone conforme necessário */
    height: 20px;
  }

  .show-password-btn:hover {
    opacity: 0.7; /* Diminui a opacidade para efeito de hover */
  }

  .show-password-btn:hover {
    opacity: 0.5;
  }
</style>
