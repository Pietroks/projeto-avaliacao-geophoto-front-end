<template>
  <div class="backgroundImg">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="containerCadastro">
            <h1>Faça o seu login</h1>
            <form @submit.prevent="login" class="containerForm">
              <div class="input-group">
                <EnvelopeIcon class="icon" />
                <input v-model="email" type="email" placeholder="Email" required />
              </div>
              <div class="input-group">
                <LockClosedIcon class="icon" />
                <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Senha" />
                <button type="button" @click="togglePasswordVisibility" :class="{'active': showPassword}" class="show-password-btn">
                  <EyeIcon class="eye-icon" />
                </button>
              </div>
              <button type="submit" class="buttonCadastro">Entrar</button>
            </form>
            <p>Não tem uma conta? <router-link to="/cadastro" class="link">Cadastre-se</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/solid';
import { EyeIcon } from '@heroicons/vue/24/outline';
import { mapActions } from 'vuex'; // Importando mapActions
import { API_URL } from '@/config/config';

export default {
  name: 'LoginPage',
  components: {
    EnvelopeIcon,
    LockClosedIcon,
    EyeIcon,
  },
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
    };
  },
  methods: {
    // Mapeando a action do Vuex
    ...mapActions("user", ["login"]), 
    
    async login() {
      const jsonData = {
        email: this.email,
        password: this.password,
      };

      try {
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.token && data.user) {
            // Chamando a action 'login' do Vuex para armazenar o usuário e token
            this.login({ user: data.user, token: data.token });

            // Armazenando o token no localStorage para persistência
            localStorage.setItem("authToken", data.token);

            // Redireciona para a página inicial após o login bem-sucedido
            this.$router.push('/');
          } else {
            alert('Credenciais inválidas!');
          }
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
