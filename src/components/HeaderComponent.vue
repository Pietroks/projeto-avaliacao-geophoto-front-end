<template>
  <section class="container">
    <div class="row">
      <div class="col-12 containerHeader">
        <div class="col-md-4 divLogo">
          <router-link to="/" class="Logo">
            <img :src="logoImage" class="img-fluid imgLogo" alt="Logo">
          </router-link>
        </div>
        
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
        
        <!-- Seção de login / foto do usuário -->
        <div class="col-md-4 divLogin">
          <template v-if="isLoggedIn">
            <img :src="user.profilePic" class="profileImage" alt="Profile Picture">
            <button @click="logout" class="logoutButton">Sair</button>
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
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import logo from '@/assets/Diamond-jewelry-logo-design-premium-Graphics-14779073-1-1-580x387.jpg';

export default {
  name: 'HeaderComponent',
  data() {
    return {
      logoImage: logo,
      selectedLink: '/'
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
    }
  },
  mounted() {
    this.$store.dispatch("user/checkLoginStatus");
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

  .profileImage {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
  }

  .logoutButton {
    background: none;
    border: none;
    color: brown;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease-in-out;
  }

  .logoutButton:hover {
    color: darkred;
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
</style>
