<template>
  <section class="sobre-section">
    <div class="container py-5">
      <div class="row align-items-center flex-column-reverse flex-md-row">
        <div class="col-md-6">
          <div class="texto-card">
            <h3 class="titulo-lagim">LAGIM</h3>
            <h4 class="subtitulo-lab">Laboratório Geoconografia e de Multimídia</h4>
            <p class="paragrafo">
              A Geografia é a ciência que estuda a superfície terrestre, as interações entre os elementos naturais e sociais e como eles
              moldam o espaço em que vivemos. Desde a análise de paisagens naturais até o impacto das ações humanas, a Geografia é essencial
              para entender nosso mundo.
            </p>
          </div>
        </div>

        <div class="col-md-6 logo-col text-center">
          <img src="../assets/logo.webp" alt="Logo do Laboratório LAGIM" class="img-fluid logo-img" />
          <h2 class="titulo-dinamicas">Explorando o mundo e suas dinâmicas</h2>
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
.sobre-section {
  color: black;
  background: url("../assets/hex3.webp") no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  position: relative;
  margin-bottom: 3rem;
}

.texto-card {
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);
  text-align: center;
}

@media (min-width: 768px) {
  .texto-card {
    text-align: left;
  }
}

.titulo-lagim {
  font-size: 3.5rem;
  color: #0464d1;
  font-weight: 800;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.subtitulo-lab {
  font-size: 1.25rem;
  margin-top: -10px;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.paragrafo {
  font-size: 1.1rem;
  line-height: 1.8;
  font-weight: 400;
}

.logo-col {
  margin-bottom: 2rem;
}

.logo-img {
  max-width: 100%;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.titulo-dinamicas {
  font-size: 1.5rem;
  text-align: center;
  color: #137abe;
  padding: 0.8rem 1rem;
  margin-top: 1.5rem;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* --- AJUSTES DE RESPONSIVIDADE (MEDIA QUERIES) --- */

@media (min-width: 992px) {
  .titulo-lagim {
    font-size: 5rem;
  }
  .paragrafo {
    font-size: 1.2rem;
  }
  .titulo-dinamicas {
    font-size: 2rem;
  }
}

@media (min-width: 1200px) {
  .titulo-lagim {
    font-size: 6rem;
  }
  .paragrafo {
    font-size: 1.4rem;
  }
  .titulo-dinamicas {
    font-size: 2.5rem;
  }
}
</style>
