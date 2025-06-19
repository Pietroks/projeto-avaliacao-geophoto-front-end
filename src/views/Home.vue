<template>
  <section class="hero">
    <div class="container text-center py-5">
      <h1 class="main-title">Geofotografia</h1>
      <h2 class="sub-title">Capturando a beleza natural da Terra</h2>
      <p class="hero-description">
        Geophotography is the art of capturing images of the Earth’s surface in
        order to capture its beauty and share it with others. It can range from
        simple snapshots taken with a smartphone to complex shots taken with
        expensive equipment by professionals who have spent years mastering
        their craft.
      </p>
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

import img1 from "@/assets/indy-bruhin-LolOOsux0vk-unsplash.jpg";
import img2 from "@/assets/pascal-scholl-RFrM7_t2F2E-unsplash.jpg";
import img3 from "@/assets/thumb-1920-526183.jpg";

import montanhas from "@/assets/17638-3840x2160-desktop-4k-forest-background.jpg";
import rios from "@/assets/forest-mist-scenery-2k-wallpaper-uhdpaper.com-844@3@a.jpg";
import florestas from "@/assets/indy-bruhin-LolOOsux0vk-unsplash.jpg";

library.add(faArrowRight);

export default {
  name: "HomePage",
  components: { Footer, FontAwesomeIcon },
  data() {
    return {
      currentIndex: 0,
      images: [img1, img2, img3],
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
  background-image: url("@/assets/tim-stief-YFFGkE3y4F8-unsplash.jpg");
  background-size: cover;
  background-position: center;
  color: white;
  padding: 6rem 0;
}

.main-title {
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: 4px;
}

.sub-title {
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 1.5rem;
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
