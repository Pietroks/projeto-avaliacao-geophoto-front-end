<template>
  <section class="backgroundColor">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-12">
          <div class="divTexto">
            <h3 class="titulo1">
              Prêmio Brasileiro de Fotogeografia 2024/2025
            </h3>
            <p class="paragrafo">
              O Prêmio Brasileiro de Fotogeografia, uma iniciativa do LAGIM
              (Laboratório de Geoiconografia e Multimídias) da Universidade de
              Brasília, é voltado para estudantes e profissionais de Geografia,
              incentivando a produção de imagens geográficas.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="background2">
    <div class="container">
      <div class="row align-items-start">
        <div class="col-md-6">
          <div class="divTexto">
            <h3 class="titulo2">Categorias</h3>
            <p class="paragrafo2">
              O Prêmio Brasileiro de Fotogeografia tem as seguintes categorias:
            </p>
            <ul>
              <li>Categoria 1: Estudantes de Graduação</li>
              <li>Categoria 2: Estudantes de Pós-Graduação</li>
              <li>Categoria 3: Profissionais Graduados</li>
            </ul>
          </div>
        </div>
        <div class="col-md-6">
          <div class="divTexto">
            <h3 class="titulo2">Premiação</h3>
            <p class="paragrafo2">A premiação inclui:</p>
            <ul>
              <li>Medalha LAGIM de Fotogeografia</li>
              <li>Certificado de Participação</li>
              <li>
                Inclusão no e-book para os três primeiros de cada subcategoria
              </li>
              <li><strong>1º Lugar:</strong> Câmera instantânea</li>
              <li><strong>2º Lugar:</strong> Cartão Micro-SD 64GB</li>
              <li><strong>3º Lugar:</strong> Tripé de 1,45m</li>
              <li>
                Certificado de Participação para os classificados até o 10º
                lugar
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="container-fluid background2">
    <h2 class="mt-4 titulo">Cronograma</h2>
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="table-responsive">
          <table class="table table-bordered table-custom">
            <thead>
              <tr>
                <th>Etapa</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Abertura e publicação do edital</td>
                <td>21/11/2024</td>
              </tr>
              <tr>
                <td>Período de inscrições</td>
                <td>02/12/2024 a 10/02/2025</td>
              </tr>
              <tr>
                <td>Avaliação</td>
                <td>11/02/2025 a 11/03/2025</td>
              </tr>
              <tr>
                <td>Reunião da comissão</td>
                <td>12 e 13/03/2025</td>
              </tr>
              <tr>
                <td>Divulgação do resultado</td>
                <td>14/03/2025</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="text-center divButton">
          <a href="#" target="_blank" class="buttonInscrevase">
            Acesse o Edital
          </a>
        </div>
      </div>
    </div>
  </section>

  <Footer />
</template>

<script>
import Footer from "@/components/Footer.vue";

export default {
  name: "PremiacaoPage",
  components: {
    Footer,
  },
};
</script>

<style scoped>
.backgroundColor {
  color: whitesmoke;
  background: linear-gradient(to top, #010020, #1b013d, #2e014f, #3d025e);
  padding: 4rem 1rem;
}

.divTexto {
  margin-bottom: 2rem;
}

.titulo1 {
  font-size: 4rem;
  color: chartreuse;
  text-align: center;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.paragrafo {
  font-size: 1.2rem;
  line-height: 2;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
}

.background2 {
  background-color: #010020;
  color: whitesmoke;
  padding: 4rem 1rem;
}

.titulo2 {
  font-size: 2rem;
  color: chartreuse;
  margin-bottom: 1rem;
}

.paragrafo2 {
  font-size: 1rem;
  line-height: 1.8;
}

ul li {
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 0.3rem;
}

.titulo {
  font-size: 2.2rem;
  color: chartreuse;
  text-align: center;
  margin-bottom: 2rem;
}

.table-custom {
  border-collapse: separate;
  border-spacing: 0 10px;
  width: 100%;
  background: transparent;
}

.table-custom th,
.table-custom td {
  text-align: center;
  padding: 1rem;
  background-color: #222;
  color: whitesmoke;
  border: 1px solid #444;
}

.table-custom th {
  background-color: #333;
  color: chartreuse;
}

.table-custom tr:hover {
  background-color: #444;
  transform: scale(1.01);
  transition: 0.2s;
}

.buttonInscrevase {
  background: #00214b;
  color: snow;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  font-size: 1.2rem;
  transition: all 0.3s ease-in-out;
  text-decoration: none;
}

.buttonInscrevase:hover {
  background: silver;
  color: #212121;
  transform: scale(1.05);
  box-shadow: 0 0 15px #000;
}

@media (max-width: 767px) {
  .titulo1 {
    font-size: 2.5rem;
  }

  .paragrafo {
    font-size: 1rem;
  }

  .titulo2 {
    font-size: 1.5rem;
  }

  .table-custom {
    font-size: 0.9rem;
  }
}
</style>
