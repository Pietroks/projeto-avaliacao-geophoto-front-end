<template>
  <section class="backgroundColor">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="containerSobre">
            <div class="divLogo">
              <img src="../assets/logo.png" alt="">
              <h2>Faculdade Xing Ling</h2>
            </div>
            <h3>Explorando o mundo e suas dinâmicas</h3>
            <p>A Geografia é a ciência que estuda a superfície terrestre, as interações entre os elementos naturais e sociais e como eles moldam o espaço em que vivemos. 
              Desde a análise de paisagens naturais até o impacto das ações humanas, a Geografia é essencial para entender nosso mundo.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

  
  <script>
  export default {
    name: 'SobrePage',
  };
  </script>

<style scoped>
  .backgroundColor {
    background: #010020;
    color: whitesmoke;
  }

  .backgroundColor::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../assets/tim-stief-YFFGkE3y4F8-unsplash.jpg');
    background-size: cover;
    background-position: top;
    background-repeat: no-repeat;
    opacity: 1;
    z-index: -1;
  }
</style>
  