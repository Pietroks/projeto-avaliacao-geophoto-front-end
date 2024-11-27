<template>
  <section class="container">
    <div class="row">
      <div class="col-12 containerHeader">
        <!-- Logo -->
        <div class="col-md-4 divLogo">
          <router-link to="/" class="Logo">
            <img :src="logoImage" class="img-fluid imgLogo" alt="Logo">
          </router-link>
        </div>

        <!-- Menu de navegação -->
        <div class="col-md-4 divNav">
          <router-link
            to="/"
            :class="['navLink', { 'navLinkActive': selectedLink === '/' }]"
            @click="selectLink('/')"
          >Inicio</router-link>
          <router-link
            to="/sobre"
            :class="['navLink', { 'navLinkActive': selectedLink === '/sobre' }]"
            @click="selectLink('/sobre')"
          >Sobre</router-link>
          <router-link
            to="/concurso"
            class="buttonCadastro"
          >Acesse o Concurso</router-link>
          <router-link
            to="/premiacao"
            :class="['navLink', { 'navLinkActive': selectedLink === '/premiacao' }]"
            @click="selectLink('/premiacao')"
          >Premiação</router-link>  
        </div>

        <!-- Ícone ou botões de login -->
        <div class="col-md-4 divLogin">
          <!-- Mobile: Ícone para abrir menu -->
          <div class="d-md-none">
            <button class="btn btn-icon" @click="toggleMenuLogin">
              <UserIcon class="heroicon" />
            </button>
          </div>
          <!-- Desktop ou menu aberto no mobile -->
          <div 
            :class="{'d-none d-md-flex': !menuLoginAberto, 'd-block': menuLoginAberto}"
            class="login-buttons"
          >
            <template v-if="isLoggedIn">
              <button 
                @click="redirectToDashboard" 
                class="btn btn-outline-primary"
              >
                Meu Perfil
              </button>
              <button 
                @click="logout" 
                class="btn btn-danger ms-2"
              >
                Sair
              </button>
            </template>
            <template v-else>
              <router-link
                to="/login"
                :class="['navLink', { 'navLinkActive': selectedLink === '/login' }]"
                @click="selectLink('/login')"
              >Entrar</router-link>
              <router-link
                to="/cadastro"
                class="buttonCadastro"
              >Cadastre-se</router-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>



<script>
import { mapState, mapActions } from "vuex";
import logo from '@/assets/Diamond-jewelry-logo-design-premium-Graphics-14779073-1-1-580x387.jpg';
import { UserIcon } from "@heroicons/vue/24/solid";

export default {
  name: 'HeaderComponent',
  components: {
    UserIcon,
  },  
  data() {
    return {
      logoImage: logo,
      selectedLink: '/',
      menuLoginAberto: false,
    };
  },
  computed: {
    ...mapState("user", ["user", "token"]),
    isLoggedIn() {
      return !!this.token; 
    }
  },
  methods: {
    ...mapActions("user", ["logout"]),
    selectLink(link) {
      this.selectedLink = link;
      this.menuLoginAberto = false;
    },
    toggleMenuLogin() {
      this.menuLoginAberto = !this.menuLoginAberto;
    },
    redirectToDashboard() {
      this.$router.push({ name: "dashboard" });
    }
  },
  mounted() {
    this.$store.dispatch("user/checkLoginStatus");
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch("user/checkLoginStatus");
    next();
  }
};
</script>

<style scoped>
.containerHeader {
  display: flex;
  align-items: center;
  margin: 3rem auto;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border-radius: 30px;
  position: relative;
}

.divLogo {
  display: flex;
  justify-content: flex-start;
}

.imgLogo {
  width: 105px;
  height: auto;
  border-radius: 20px;
}

.divNav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.divLogin {
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
  align-items: center;
}

.login-buttons {
  display: flex;
  flex-direction: row; /* Padrão */
  gap: 1rem;
  transition: all 0.3s ease-in-out;
}

.login-buttons.d-block {
  flex-direction: column; /* Alinhar em coluna quando o menu estiver aberto */
  gap: 0.5rem; /* Ajustar espaçamento entre os itens */
}

.logoutButton {
  background: none;
  border: none;
  color: brown;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s ease-in-out;
}

.d-md-none .btn-icon {
font-size: 1.5rem;
background: none;
border: none;
cursor: pointer;
}

.btn-icon {
  font-size: 2rem;
  background: none;
  border: none;
  color: #212121; /* Cor padrão */
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: color 0.3s ease, transform 0.2s ease;
}

.btn-icon:hover {
  color: #137ABE; /* Cor de destaque ao passar o mouse */
  transform: scale(1.1); /* Efeito de zoom leve */
}

.btn-icon:active {
  transform: scale(0.95); /* Efeito ao clicar */
}

.heroicon {
  width: 24px;
  height: 24px;
  color: #212121; /* Cor padrão */
  transition: color 0.3s ease, transform 0.2s ease;
}

.heroicon:hover {
  color: #137ABE; /* Cor de destaque ao passar o mouse */
  transform: scale(1.1);
}

.heroicon:active {
  transform: scale(0.95);
}


.navLink, .buttonCadastro {
  text-decoration: none;
  color: #212121;
  font-weight: 700;
  font-size: 1rem;
  position: relative;
  transition: all 0.3s ease-in-out;
}

.navLinkActive {
  color: brown;
  transform: scale(1.1);
}

.navLink::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: brown;
  transform: scaleX(0);
  transform-origin: bottom right;
  transition: transform 0.3s ease-in-out;
}

.navLink:hover::after {
  transform: scaleX(1);
}

.navLink:hover {
  color: brown;
  transform: scale(1.1);
}

.navLink:active {
  transform: scale(1);
}

.buttonCadastro {
  border: 2px solid brown;
  border-radius: 10px;
  padding: 0.5rem;
  transition: 0.3s ease-in-out;
}

.buttonCadastro:hover {
  background: brown;
  color: whitesmoke;
}

@media (max-width: 767px) {
  .containerHeader[data-v-5c833af0] {
    width: 98%;
  }

  .divLogo[data-v-5c833af0] {
    display: none;
  }

  .divNav[data-v-5c833af0] {
    gap: 1rem;
  }

  .buttonCadastro[data-v-5c833af0] {
    padding: 0rem;
    border: none;
    text-align: center;
  }

  .navLink[data-v-5c833af0], .buttonCadastro[data-v-5c833af0] {
    font-size: 0.8rem;
  }

  .login-buttons {
    align-items: center; /* Centralizar os itens em telas menores */
    text-align: center;
  }

  .login-buttons.d-block[data-v-5c833af0] {
    flex-direction: column !important;
      gap: 0.5rem;
      display: flex !important;
      position: absolute;
      top: 75%;
      align-items: center;
      background: aliceblue;
      border-radius: 2px;
      padding: 0.5rem;
      left: 71%;
      gap: 1rem;
  }
}
</style>
