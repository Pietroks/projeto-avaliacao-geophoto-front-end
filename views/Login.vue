<template>
  <div class="backgroundImg">
    <div class="container">
      <div class="containerCadastro">
        <h1>Faça o seu login</h1>
        <form @submit.prevent="handleLogin" class="containerForm">
          <div class="input-group">
            <EnvelopeIcon class="icon" />
            <input v-model="email" type="email" placeholder="Email" required />
          </div>
          <div class="input-group password-group">
            <LockClosedIcon class="icon" />
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Senha"
              required
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="show-password-btn"
              :class="{ active: showPassword }"
            >
              <EyeIcon class="eye-icon" />
            </button>
          </div>
          <button :disabled="isLoading" type="submit" class="buttonCadastro">
            {{ isLoading ? "Entrando..." : "Entrar" }}
          </button>
        </form>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p>
          Não tem uma conta?
          <router-link to="/cadastro" class="link">Cadastre-se</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/vue/24/solid";
import { EyeIcon } from "@heroicons/vue/24/outline";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "LoginPage",
  components: {
    EnvelopeIcon,
    LockClosedIcon,
    EyeIcon,
  },
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      isLoading: false,
      errorMessage: "",
    };
  },
  computed: {
    ...mapGetters("user", ["isAuthenticated"]),
  },
  methods: {
    ...mapActions("user", ["login"]),

    async handleLogin() {
      this.errorMessage = "";
      this.isLoading = true;

      try {
        await this.login({ email: this.email, password: this.password });
        this.$router.push("/dashboard");
      } catch (error) {
        this.errorMessage = error.message || "Erro ao realizar login.";
      } finally {
        this.isLoading = false;
      }
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
  mounted() {
    if (this.isAuthenticated) {
      this.$router.push("/");
    }
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
  color: ghostwhite;
  font-weight: 100;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
  position: relative;
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
  background: transparent;
  color: #eee;
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
  margin: 0 auto 2rem;
}

.buttonCadastro:hover {
  background-color: darkred;
}

p {
  font-weight: 500;
  color: gainsboro;
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
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity 0.3s ease-in-out;
  color: #aaa;
}

.show-password-btn.active {
  color: #fff;
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
