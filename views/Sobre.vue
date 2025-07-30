<template>
  <section class="backgroundColor">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6">
          <div class="divTexto">
            <h3 class="titulo1">LAGIM</h3>
            <h4>Laboratório Geoconografia e de Multimídia</h4>
            <p class="paragrafo">
              A Geografia é a ciência que estuda a superfície terrestre, as interações entre os elementos naturais e sociais e como eles
              moldam o espaço em que vivemos. Desde a análise de paisagens naturais até o impacto das ações humanas, a Geografia é essencial
              para entender nosso mundo.
            </p>
          </div>
        </div>
        <div class="col-md-6 text-end">
          <div class="divLogo">
            <img src="../assets/logo.png" alt="Logo Faculdade Xing Ling" class="img-fluid mb-3" />
            <h2 class="titulo">Explorando o mundo e suas dinâmicas</h2>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="background2">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6 text-start">
          <div class="divLogo">
            <img src="../assets/size_960_16_9_kenan-flagler-business-school6.webp" alt="Logo Faculdade Xing Ling" class="img-fluid mb-3" />
            <h2 class="titulo3">Conectando conhecimento e inovação para moldar o futuro global</h2>
          </div>
        </div>
        <div class="col-md-6">
          <div class="divTexto">
            <h3 class="titulo2">Conheça nossa História</h3>
            <p class="paragrafo2">
              A Geografia é a ciência que estuda a superfície terrestre, as interações entre os elementos naturais e sociais e como eles
              moldam o espaço em que vivemos. Desde a análise de paisagens naturais até o impacto das ações humanas, a Geografia é essencial
              para entender nosso mundo.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="background2">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6 text-start">
          <div class="divLogo">
            <img src="../assets/University-of-California-Berkeley.webp" alt="Logo Faculdade Xing Ling" class="img-fluid mb-3" />
            <h2 class="titulo3">Ampliando horizontes, explorando culturas e construindo soluções para o amanhã</h2>
          </div>
        </div>
        <div class="col-md-6">
          <div class="divTexto">
            <h3 class="titulo2">Venha fazer parte desta História</h3>
            <p class="paragrafo2">
              A Geografia é a ciência que estuda a superfície terrestre, as interações entre os elementos naturais e sociais e como eles
              moldam o espaço em que vivemos. Desde a análise de paisagens naturais até o impacto das ações humanas, a Geografia é essencial
              para entender nosso mundo.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <Footer />
</template>

<script>
import Footer from "@/components/Footer.vue";

export default {
  name: "SobrePage",
  components: {
    Footer,
  },
};
</script>

<style scoped>
.backgroundColor {
  color: black;
}

.containerSobre {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row-reverse;
  margin-top: 2rem;
}

.divTexto {
  display: flex;
  flex-direction: column;
  margin: 3rem 0;
}

.divLogo {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 3rem 0;
}

.divLogo img {
  width: 100%;
  height: auto;
  border-radius: 20px;
}

.titulo {
  font-size: 2.5rem;
  text-align: center;
  color: #137abe;
  padding: 0.5rem;
  background: transparent;
  border-radius: 20px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.titulo1 {
  font-size: 6rem;
  color: #137abe;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.paragrafo {
  font-size: 1.4rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  line-height: 2;
  padding: 0.3rem;
  background: transparent;
  border-radius: 20px;
}

.background2 {
  background: black;
}

.titulo2 {
  font-size: 2rem;
  color: #137abe;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.titulo3 {
  font-size: 0.8rem;
  color: whitesmoke;
  font-weight: 200;
  text-align: center;
  font-style: italic;
}

.paragrafo2 {
  color: whitesmoke;
  font-size: 1.2rem;
  line-height: 2;
  margin-top: 2rem;
}

@media (max-width: 1366px) {
  .titulo1[data-v-013883ef] {
    font-size: 5rem;
  }

  .paragrafo[data-v-013883ef] {
    font-size: 1.1rem;
  }

  .divLogo img[data-v-013883ef] {
    width: 380px;
    height: auto;
  }

  .titulo[data-v-013883ef] {
    font-size: 2rem;
  }
}

@media (max-width: 1114px) {
  .divTexto[data-v-013883ef] {
    margin-top: 1rem;
    margin-bottom: 0rem;
  }

  .titulo1[data-v-013883ef] {
    font-size: 3.5rem;
  }

  .divLogo img[data-v-013883ef] {
    width: 375px;
    height: auto;
    margin-top: 1rem;
  }

  .paragrafo[data-v-013883ef] {
    font-size: 1rem;
  }

  .titulo[data-v-013883ef] {
    font-size: 1.5rem;
  }

  .paragrafo2[data-v-013883ef] {
    margin-top: auto;
    font-size: 1rem;
  }
}

@media (max-width: 767px) {
  .titulo1[data-v-013883ef] {
    font-size: 3.5rem;
  }

  .paragrafo[data-v-013883ef] {
    font-size: 1rem;
    line-height: normal;
    padding: 0;
    margin-bottom: 0rem;
  }
}
</style>
