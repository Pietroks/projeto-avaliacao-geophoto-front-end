<template>
  <section class="backgroundColor">
    <div class="container">
      <div class="row align-items-center py-5">
        <div class="col-md-6">
          <div class="divTexto">
            <h3 class="titulo1">Faculdade Xing Ling</h3>
            <p class="paragrafo">
              A Geografia é a ciência que estuda a superfície terrestre, as
              interações entre os elementos naturais e sociais e como eles
              moldam o espaço em que vivemos. Desde a análise de paisagens
              naturais até o impacto das ações humanas, a Geografia é essencial
              para entender nosso mundo.
            </p>
          </div>
        </div>
        <div class="col-md-6 text-center">
          <div class="divLogo">
            <img
              src="../assets/Diamond-jewelry-logo-design-premium-Graphics-14779073-1-1-580x387.jpg"
              alt="Logo Faculdade Xing Ling"
              class="img-fluid mb-3"
            />
            <h2 class="titulo">Explorando o mundo e suas dinâmicas</h2>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="background2">
    <div class="container">
      <div class="row align-items-center py-5">
        <div class="col-md-6 text-center">
          <div class="divLogo">
            <img
              src="../assets/size_960_16_9_kenan-flagler-business-school6.webp"
              alt="Imagem da história"
              class="img-fluid mb-3"
            />
            <h2 class="titulo3">
              Conectando conhecimento e inovação para moldar o futuro global
            </h2>
          </div>
        </div>
        <div class="col-md-6">
          <div class="divTexto">
            <h3 class="titulo2">Conheça nossa História</h3>
            <p class="paragrafo2">
              Desde a análise de paisagens naturais até o impacto das ações
              humanas, a Geografia é essencial para entender nosso mundo e atuar
              de forma consciente e transformadora.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="background2">
    <div class="container">
      <div class="row align-items-center py-5">
        <div class="col-md-6 text-center">
          <div class="divLogo">
            <img
              src="../assets/University-of-California-Berkeley.webp"
              alt="Universidade Parceira"
              class="img-fluid mb-3"
            />
            <h2 class="titulo3">
              Ampliando horizontes, explorando culturas e construindo soluções
              para o amanhã
            </h2>
          </div>
        </div>
        <div class="col-md-6">
          <div class="divTexto">
            <h3 class="titulo2">Venha fazer parte desta História</h3>
            <p class="paragrafo2">
              A Geografia permite entender a complexidade do planeta e
              desenvolver soluções inovadoras para os desafios contemporâneos.
              Junte-se a nós!
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
  components: { Footer },
};
</script>

<style scoped>
.backgroundColor {
  color: whitesmoke;
  position: relative;
}

.backgroundColor::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, #010020, #1b013d, #2e014f, #3d025e);
  opacity: 1;
  z-index: -1;
}

.background2 {
  background: #010020;
  color: whitesmoke;
}

.divTexto {
  padding: 2rem 1rem;
}

.divLogo img {
  border-radius: 20px;
  max-width: 100%;
  height: auto;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.titulo1 {
  font-size: 3rem;
  color: chartreuse;
  font-weight: bold;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6);
}

.titulo2 {
  font-size: 2rem;
  color: chartreuse;
  margin-bottom: 1rem;
}

.titulo3 {
  font-size: 1.2rem;
  color: #ccc;
  font-style: italic;
  margin-top: 1rem;
  padding: 0 1rem;
}

.paragrafo,
.paragrafo2 {
  font-size: 1.2rem;
  line-height: 1.8;
  color: whitesmoke;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
}

@media (max-width: 768px) {
  .titulo1 {
    font-size: 2rem;
    text-align: center;
  }

  .titulo2 {
    font-size: 1.5rem;
    text-align: center;
  }

  .titulo3 {
    font-size: 1rem;
    text-align: center;
  }

  .paragrafo,
  .paragrafo2 {
    font-size: 1rem;
    text-align: center;
  }

  .divTexto {
    text-align: center;
  }
}
</style>
