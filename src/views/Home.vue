<template>
  <div class="backgroundImg">
    <div class="container containerHome">
      <div class="row">
        <div class="col-12">
          <div class="divTitulo">
            <h1><span>Geofotografia:</span></h1>
            <a href="#inscrevase" class="linkInscrevase"><h2>Capturando a beleza natural da Terra</h2></a>
          </div>
        </div>
        <div class="col-md-6">
          <div class="imageBox">
            <p>Geophotography is the art of capturing images of the Earth’s surface in order to capture its beauty and share it with others.
              It can range from simple snapshots taken with a smartphone to complex shots taken with expensive equipment by professionals who have spent years mastering their craft.</p>
          </div>
        </div>     
      </div>
    </div>
  </div>

  <section class="backgroundBlack">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="div2">
            <h2 class="subtitulo">O que é Geofotografia?</h2>
            <p class="paragrafo">Geophotography has been around for centuries, but became popularized in recent years thanks to social media platforms like Instagram and Facebook where users have access to millions of other people who appreciate their work.</p>
          </div>
          <div class="div2">
            <h2 class="subtitulo">Tecnicas para a Geofotografia</h2>
            <p class="paragrafo">Lighting is the most important aspect of geophotography.</p>
            <p class="paragrafo">If you don’t have good lighting, your photos will be dull and flat.</p>
            <p class="paragrafo">The best time to shoot is during sunrise or sunset when the sun is low in the sky, which creates long shadows and dramatic lighting effects</p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="div2">
            <h2 class="subtitulo">Equipamentos para Geofotografia</h2>
            <p class="paragrafo">Cameras. The first thing you need for geophotography is a camera, and there are many options to choose from.</p>
            <p class="paragrafo">A DSLR is the most common choice because it allows you to change lenses and adjust settings on your own.</p>
            <p class="paragrafo">However, if you’re just starting out with geophotography or don’t want to spend too much money on equipment, then an entry-level point-and-shoot camera may be more suitable for your needs.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="backgroundGray">
    <div class="container">
      <div class="row">
        <div class="containerConcurso">
          <div class="col-md-6">
            <h2 class="subtitulo2">Participe do concurso internacional de Geofotografia</h2>
            <p class="paragrafo2">Our ocean is changing. With 70 percent of the planet covered in water, the seas are important drivers of the global climate. Yet increasing greenhouse gases from human activities are altering the ocean before our eyes. NASA and its partners are on a mission to find out more.</p>
            <div class="divSaibaMais">
              <router-link to="/sobre" class="saibaMaisButton">
                Saiba mais
                <font-awesome-icon icon="arrow-right" class="arrow-icon" />
              </router-link>
            </div>
          </div>
          <div class="col-md-6">
            <div class="carousel-container">
              <div class="carousel">
                <img v-for="(image, index) in images" :key="index" :src="image" v-show="currentIndex === index" class="carousel-image" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="backgroundImg2" id="inscrevase">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="divInscrevase">
              <h2 class="subtitulo2 subtitulo2Color">For the things you love...</h2>
              <div class="divInscrevaseP">
                <p class="paragrafo2">Se inscreva no nosso concurso e mostre todo seu talento como Geofotografo.</p>
                <p class="paragrafo2">Inspire outros com a sua visão do mundo, ganhe visibilidade para seus projetos e concorra junto com outros como você para determinar o melhor.</p>
              </div>
              <router-link to="/cadastro" class="saibaMaisButton buttonInscrevase">
                Inscreva-se
                <font-awesome-icon icon="arrow-right" class="arrow-icon" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row align-items-center">
          <div class="col-12">
            <div class="divInscrevase">
              <h2 class="subtitulo2 subtitulo2Color text-end">For the things you love...</h2>
              <div class="divInscrevaseP">
                <p class="paragrafo2 text-end">Participe do concurso e concorra a premios até a terceira colocação</p>
                <p class="paragrafo2 text-end">Se junte nessa batalha contra outros amantes da Geofotografia. Contribua para a divulgação dessa area e ganhe premios e destaque para você nessa área.</p>
              </div>
              <div class="text-end">
                <router-link to="/premiacao" class="saibaMaisButton buttonInscrevase">
                  Saiba mais
                  <font-awesome-icon icon="arrow-right" class="arrow-icon" />
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
  </section>
</template>
  
<script>
  import img1 from '@/assets/indy-bruhin-LolOOsux0vk-unsplash.jpg';
  import img2 from '@/assets/pascal-scholl-RFrM7_t2F2E-unsplash.jpg';
  import img3 from '@/assets/thumb-1920-526183.jpg';
  import img4 from '@/assets/giorgi-iremadze-kKV97pFt0-A-unsplash.jpg';

  import { library } from '@fortawesome/fontawesome-svg-core';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

  library.add(faArrowRight);
  
  export default {
    name: 'HomePage',
    components: {
      FontAwesomeIcon
    },
    data() {
      return {
        images: [img1, img2, img3, img4],
        currentIndex: 0,
      };
    },
    
    mounted() {
      this.startCarousel();
    },

    beforeUnmount() {
      clearInterval(this.carouselInterval)
    },

    methods: {
      startCarousel() {
        this.carouselInterval = setInterval(() => {
          this.nextImage();
        }, 3000);
      },

      nextImage() {
        this.currentIndex = (this.currentIndex + 1 ) % this.images.length;
      },
    },
  }
  </script>
  
<style scoped>
.backgroundImg {
  background-image: url('../assets/tim-stief-YFFGkE3y4F8-unsplash.jpg');
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -11.4rem;
}

  .containerHome {
      margin: 3rem auto;
  }

.divTitulo {
  margin-bottom: 7rem;
  margin-top: 12rem;
}

.linkInscrevase {
    text-decoration: none;
    transition: 0.3s ease-in-out; 
}

h2 {
  font-size: 4rem;
  font-weight: 300;
  color: azure;
  letter-spacing: 10px;
  margin-top: 3rem;
  transition: 0.3s ease-in-out; 
}

.linkInscrevase:hover h2 {
    color: #212121; 
}

span {
  color: #212121;
  letter-spacing: 20px;
  font-size: 5.5rem;
  font-weight: 300;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border-radius: 20px
}

p {
    line-height: 2;
    font-size: 1rem;
    color: #F8F8F8;
}

.backgroundBlack {
  background: #000000;
}

.div2 {
  margin: 3rem 0;
}

.subtitulo {
  font-size: 2rem;
  margin-bottom: 1rem;
  letter-spacing: 2px;
  color: brown;
}

.paragrafo {
  font-size: 1rem;
  font-weight: 100;
  letter-spacing: 0px;
  line-height: 1.5;
}

/* carrossel */
.backgroundGray {
  margin: 3rem auto;
  background: #F6F6F6;
}

.containerConcurso {
  display: flex;
  align-items: center;
}

.subtitulo2, .paragrafo2 {
  color: #212121;
  letter-spacing: 2px;
  font-size: 3.3rem;
  font-weight: 900;
  margin: 1rem 0;
}

.paragrafo2 {
  font-size: 1rem;
  color: #000;
  font-weight: 400;
}

.divSaibaMais {
  display: flex;
  align-items: center;
  margin: 2rem 0;
}

.saibaMaisButton {
  display: inline-flex;
  align-items: center;
  color: #212121;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
  font-size: 1.5rem;
}

.saibaMaisButton:hover {
  opacity: 0.5;
}

.arrow-icon {
  color: white;
  background-color: red;
  border-radius: 50%;
  padding: 0.2rem;
  margin-left: 0.7rem;
  transition: background-color 0.3s ease;
}

.saibaMaisButton:hover .arrow-icon {
  background-color: #d90000;
}

.carousel-container {
  width: 100%;
  overflow: hidden;
  margin-left: 2rem;
}

.carousel {
  display: flex;
  justify-content: center;
}

.carousel-image {
  max-width: 90%;
  height: 400px;
  transition: opacity 0.5s ease-in-out;
  border-radius: 20px;
  border: 2px solid;
}

/* section inscrevase */
.backgroundImg2 {
  background: linear-gradient(to bottom, #00214B, #023564, #003B6D, #3A749A);
  margin-top: 0rem;
}

.divInscrevase {
  margin: 2rem 0;
}

.subtitulo2Color {
  color: whitesmoke;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.divInscrevaseP p {
  text-align: right;
  font-size: 1.4rem;
  color: rgb(187, 183, 183);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); 
  margin-top: 1.5rem;
}

.buttonInscrevase {
  color: snow;
  font-size: 2rem;
  background: #00214B;
  padding: 0.5rem;
  border-radius: 15px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  transition: 0.3s ease-in-out;
  margin-bottom: 1rem;
}

.buttonInscrevase:hover {
  background: silver;
  color: #212121;
  transform: scale(1.02);
  border-radius: 20;
  box-shadow: 12px 22px 4px rgba(0, 0, 0, 1.5);
  opacity: 1;
}
</style>
  