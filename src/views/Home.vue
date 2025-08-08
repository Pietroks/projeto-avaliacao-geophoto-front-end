<template>
  <section class="hero">
    <div class="container text-center py-5">
      <h1 class="main-title">Geofotografia</h1>
      <h2 class="sub-title">Capturando a beleza natural da Terra</h2>
      <router-link to="/cadastro" class="cta-btn">
        Inscreva-se
        <font-awesome-icon icon="arrow-right" class="ms-2" />
      </router-link>
    </div>
  </section>

  <section class="info-section bg-dark text-light py-5" v-scroll-appear>
    <div class="container">
      <div class="row">
        <div class="col-md-4 mb-4">
          <h3 class="info-title">O que é Geofotografia?</h3>
          <p>A arte de capturar a superfície terrestre em imagens impactantes, revelando sua beleza, texturas e cores.</p>
        </div>
        <div class="col-md-4 mb-4">
          <h3 class="info-title">Técnicas</h3>
          <p>Use luz natural em amanheceres e entardeceres para efeitos dramáticos. Experimente composições com sombras.</p>
        </div>
        <div class="col-md-4 mb-4">
          <h3 class="info-title">Equipamentos</h3>
          <p>Desde DSLRs a smartphones: o essencial é ter olhar fotográfico. A lente é sua aliada.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="highlight-section py-5 bg-light">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-12 text-center mb-4">
          <h2 class="highlight-title">Participe do Concurso Nacional</h2>
          <p>
            Inspire outros com a sua visão do mundo, ganhe visibilidade para seus projetos e concorra junto com outros apaixonados por
            Geofotografia.
          </p>
          <router-link to="/premiacao" class="cta-btn"> Saiba mais <font-awesome-icon icon="arrow-right" class="ms-2" /> </router-link>
        </div>
      </div>
    </div>
  </section>

  <Footer />
</template>

<script>
import Footer from "@/components/Footer.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

library.add(faArrowRight);

export default {
  name: "HomePage",
  components: { Footer, FontAwesomeIcon },
};
</script>

<style scoped>
body {
  background: #212121;
}

.hero {
  background-image: url("@/assets/hex2.webp");
  background-size: cover;
  background-position: center;
  color: #03b6e5;
  padding: 6rem 0;
  margin-top: -5rem;
}

.main-title {
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: 4px;
  color: #2c313c;
}

.sub-title {
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 1.5rem;
  color: #2c313c;
}

.hero-description {
  max-width: 800px;
  margin: 0 auto 2rem;
  font-size: 1.1rem;
  line-height: 1.8;
}

.cta-btn {
  display: inline-block;
  background: #137abe;
  color: white;
  padding: 0.8rem 2rem;
  font-weight: bold;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
}

.cta-btn:hover {
  background: #02273f;
  filter: blur(0.5px);
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.info-title {
  font-size: 1.5rem;
  color: #f8f9fa;
  margin-bottom: 1rem;
}

.highlight-section {
  background-color: #f6f6f6;
}

.highlight-title {
  font-size: 2rem;
  color: #222;
  font-weight: 600;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .hero {
    padding: 0rem;
    margin-top: auto;
  }

  .main-title {
    font-size: 2.4rem;
  }

  .sub-title {
    font-size: 1.5rem;
  }
}
</style>
