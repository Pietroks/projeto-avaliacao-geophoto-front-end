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
          <p>
            A arte de capturar a superfície terrestre em imagens impactantes,
            revelando sua beleza, texturas e cores.
          </p>
        </div>
        <div class="col-md-4 mb-4">
          <h3 class="info-title">Técnicas</h3>
          <p>
            Use luz natural em amanheceres e entardeceres para efeitos
            dramáticos. Experimente composições com sombras.
          </p>
        </div>
        <div class="col-md-4 mb-4">
          <h3 class="info-title">Equipamentos</h3>
          <p>
            Desde DSLRs a smartphones: o essencial é ter olhar fotográfico. A
            lente é sua aliada.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="highlight-section py-5 bg-light">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h2 class="highlight-title">Participe do Concurso Internacional</h2>
          <p>
            Inspire outros com a sua visão do mundo, ganhe visibilidade para
            seus projetos e concorra junto com outros apaixonados por
            Geofotografia.
          </p>
          <router-link to="/sobre" class="cta-link">
            Saiba mais <font-awesome-icon icon="arrow-right" class="ms-2" />
          </router-link>
        </div>
        <div class="col-md-6">
          <div class="carousel-wrapper">
            <img
              :src="images[currentIndex]"
              alt="Imagem do carrossel"
              class="img-fluid rounded shadow"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="gallery-section bg-gradient py-5 text-light" v-scroll-appear>
    <div class="container">
      <div class="row text-center">
        <div
          v-for="(item, index) in gallery"
          :key="index"
          class="col-12 col-md-4 mb-4"
        >
          <div
            class="gallery-card"
            :style="{ backgroundImage: `url(${item.image})` }"
          >
            <div class="overlay">
              <h4>{{ item.title }}</h4>
            </div>
          </div>
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

import img1 from "@/assets/hex6.png";

import montanhas from "@/assets/hex3.png";
import rios from "@/assets/hex4.png";
import florestas from "@/assets/hex5.png";

library.add(faArrowRight);

export default {
  name: "HomePage",
  components: { Footer, FontAwesomeIcon },
  data() {
    return {
      currentIndex: 0,
      images: [img1],
      gallery: [
        { title: "Montanhas", image: montanhas },
        { title: "Rios", image: rios },
        { title: "Florestas", image: florestas },
      ],
    };
  },
  mounted() {
    this.carouselInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 4000);
  },
  beforeUnmount() {
    clearInterval(this.carouselInterval);
  },
};
</script>

<style scoped>
body {
  background: #212121;
}

.hero {
  background-image: url("@/assets/hex2.png");
  background-size: cover;
  background-position: center;
  color: #03b6e5;;
  padding: 6rem 0;
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
  color:#2c313c;
}

.hero-description {
  max-width: 800px;
  margin: 0 auto 2rem;
  font-size: 1.1rem;
  line-height: 1.8;
}

.cta-btn {
  background: #137abe;
  color: white;
  padding: 0.8rem 2rem;
  font-weight: bold;
  border-radius: 10px;
  text-decoration: none;
  transition: 0.3s ease;
}

.cta-btn:hover {
  background: #0f5c8f;
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

.cta-link {
  text-decoration: none;
  font-weight: 500;
  color: #137abe;
  font-size: 1.2rem;
}

.carousel-wrapper img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.gallery-section {
  background: linear-gradient(to right, #010020, #1b013d);
}

.gallery-card {
  position: relative;
  background-size: cover;
  background-position: center;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
}

.overlay {
  background: rgba(0, 0, 0, 0.6);
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 0.5rem;
}

.overlay h4 {
  color: #fff;
  margin: 0;
  font-weight: 600;
}
</style>
