<template>
  <section class="header-section py-2">
    <div class="container">
      <nav class="navbar navbar-expand-md navbar-light">
        <router-link to="/" class="navbar-brand">
          <img :src="logoImage" class="img-fluid imgLogo" alt="Logo" />
        </router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Início</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/sobre" class="nav-link">Sobre</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/premiacao" class="nav-link">Premiação</router-link>
            </li>
            <li class="nav-item d-md-none">
              <router-link to="/concurso" class="nav-link">Acesse o Concurso</router-link>
            </li>
          </ul>

          <div class="navbar-nav ms-auto align-items-center">
            <router-link to="/concurso" class="buttonCadastro d-none d-md-block">Acesse o Concurso</router-link>
            <template v-if="isLoggedIn">
              <button @click="redirectToDashboard" class="btn btn-outline-primary ms-md-2">Meu Perfil</button>
              <button @click="handleLogout" class="btn btn-danger ms-2">Sair</button>
            </template>
            <template v-else>
              <router-link to="/login" class="nav-link ms-md-2">Entrar</router-link>
              <router-link to="/cadastro" class="buttonCadastro ms-2">Cadastre-se</router-link>
            </template>
          </div>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import logo from "@/assets/logo.webp";

export default {
  name: "HeaderComponent",
  components: {
    // UserIcon,
  },
  data() {
    return {
      logoImage: logo,
    };
  },
  computed: {
    ...mapState("user", ["user", "token"]),
    isLoggedIn() {
      return !!this.token;
    },
  },
  methods: {
    ...mapActions("user", ["logout", "checkLoginStatus"]),
    redirectToDashboard() {
      this.$router.push({ name: "dashboard" });
    },
    async handleLogout() {
      await this.logout();
      if (this.$route.name !== "login") {
        this.$router.push("/login");
      }
    },
  },
  mounted() {
    this.checkLoginStatus();
  },
};
</script>

<style scoped>
.header-section {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1px);
  border-radius: 50px;
  margin: auto;
  width: 98%;
}

.imgLogo {
  width: 100px;
  height: auto;
  border-radius: 20px;
}

.nav-link {
  text-decoration: none;
  color: #0d6efd;
  font-weight: 600;
  font-size: 1rem;
  position: relative;
  transition: all 0.3s ease-in-out;
  padding: 0.5rem 1rem;
}

.nav-link.router-link-exact-active {
  color: #03b6e5;
  transform: scale(1.05);
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: #03b6e5;
  transition: width 0.3s ease-in-out;
}

.nav-link:hover::after,
.nav-link.router-link-exact-active::after {
  width: 50%;
}

.nav-link:hover {
  color: #03b6e5;
}

.buttonCadastro {
  border: 2px solid #03b6e5;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  color: #03b6e5;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
  white-space: nowrap;
}

.buttonCadastro:hover {
  background: #03b6e5;
  color: white;
  transform: scale(1.05);
}

/* Ajustes para o menu mobile quando aberto */
@media (max-width: 767px) {
  .navbar-collapse {
    text-align: center;
    margin-top: 1rem;
  }
  .navbar-nav .nav-item {
    margin-bottom: 0.5rem;
  }
}
</style>
