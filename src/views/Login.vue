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
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="Email"
                  required
                  pattern="[^@\\s]+@[^@\\s]+\\.[^@\\s]+"
                  class="form-control"
                />
              </div>
              <div class="input-group">
                <LockClosedIcon class="icon" />
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Senha"
                  required
                  class="form-control"
                />
                <button
                  type="button"
                  @click="togglePasswordVisibility"
                  :class="{'active': showPassword}"
                  class="show-password-btn btn btn-outline-secondary"
                  aria-label="Mostrar senha"
                >
                  <EyeIcon class="eye-icon" />
                </button>
              </div>
              <button :disabled="isLoading" type="submit" class="btn btn-primary w-100">
                <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {{ isLoading ? 'Entrando...' : 'Entrar' }}
              </button>
            </form>
            <p v-if="errorMessage" class="error-message text-danger mt-3">{{ errorMessage }}</p>
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
import { mapActions } from 'vuex'; 
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
      isLoading: false,
      errorMessage: '',
    };
  },
  methods: {
    ...mapActions("user", ["login"]), 
    async login() {
      if (!this.email || !this.password) {
        this.errorMessage = 'Por favor, preencha todos os campos.';
        return;
      }
      this.errorMessage = '';
      this.isLoading = true;

      try {
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.token && data.user) {
            this.login({ user: data.user, token: data.token });
            this.$router.push('/');
          } else {
            this.errorMessage = 'Credenciais inválidas!';
          }
        } else {
          this.errorMessage = 'Erro na requisição. Tente novamente mais tarde.';
        }
      } catch (error) {
        this.errorMessage = 'Erro na comunicação com o servidor.';
      } finally {
        this.isLoading = false;
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
  mounted() {
    if (this.$store.getters['user/isAuthenticated']) {
      this.$router.push('/');
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
    top: 15px;
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
  font-size: 14px;
  margin-top: 10px;
}
</style>
