<template>
    <section class="backgroundColor">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-12">
            <div class="divTexto">
              <h3 class="titulo1">Prêmio Brasileiro de Fotogeografia 2024/2025</h3>
              <p class="paragrafo">
                O Prêmio Brasileiro de Fotogeografia, uma iniciativa do LAGIM (Laboratório de Geoiconografia e Multimídias) da 
                Universidade de Brasília, é voltado para estudantes e profissionais de Geografia, incentivando a produção de imagens geográficas.
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
              <p class="paragrafo2">
                A premiação inclui:
              </p>
              <ul>
                <li>Medalha LAGIM de Fotogeografia</li>
                <li>Certificado de Participação</li>
                <li>Inclusão no e-book para os três primeiros de cada subcategoria</li>
                <li><strong>1º Lugar:</strong> Câmera instantânea</li>
                <li><strong>2º Lugar:</strong> Cartão Micro-SD 64GB</li>
                <li><strong>3º Lugar:</strong> Tripé de 1,45m</li>
                <li>Certificado de Participação para os classificados até o 10º lugar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <section class="container-fluid background2">
      <h2 class="mt-4 titulo">Cronograma</h2>
      <div class="row">
        <div class="col-12">
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
  </template>
  
  <script>
    export default {
      name: "PremiacaoPage",
    };
  </script>
  
  <style scoped>
.backgroundColor {
  color: whitesmoke;
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

.divTexto {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

.titulo {
  font-size: 2.5rem;
  text-align: center;
  color: chartreuse;
  padding: 0.5rem;
  background: transparent;
  border-radius: 20px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.titulo1 {
  font-size: 6rem;
  color: chartreuse;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.paragrafo {
  font-size: 1.4rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
  line-height: 2;
  padding: 0.3rem;
  background: transparent;
  border-radius: 20px;
}

.background2 {
  background: #010020;
  margin-top: 1rem;
}

.titulo2 {
  font-size: 2rem;
  color: chartreuse;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.paragrafo2 {
  color: whitesmoke;
  font-size: 1rem;
  line-height: 2;
  margin-top: auto;
}

ul li {
  color: whitesmoke;
  font-weight: 100;
}

.divButton {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.buttonInscrevase {
  color: snow;
  font-size: 2rem;
  background: #00214B;
  padding: 0.5rem;
  border-radius: 15px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  transition: 0.3s ease-in-out;
  text-decoration: none;
}

.buttonInscrevase:hover {
  background: silver;
  color: #212121;
  transform: scale(1.02);
  border-radius: 20;
  box-shadow: 12px 22px 4px rgba(0, 0, 0, 1.5);
  opacity: 1;
}

.table-custom {
  border-radius: 10px;
  border-collapse: separate;
  border-spacing: 0 10px;
  width: 50%;
  justify-self: center;
}

.table-custom th,
.table-custom td {
  padding: 15px;
  text-align: center;
  font-size: 1.1rem;
}

.table-custom th {
  background-color: #444;
  color: chartreuse;
}

.table-custom td {
  background-color: #222;
  color: whitesmoke;
  border: 1px solid #444;
}

.table-custom tr:hover {
  background-color: #444;
  transform: scale(1.02);
  transition: 0.2s;
}

@media (max-width: 1366px) {
  .titulo1[data-v-218bab85] {
    font-size: 3.5rem;
  }

  .paragrafo[data-v-218bab85] {
    font-size: 1.2rem;
  }

  .table-custom[data-v-218bab85] {
    width: auto;
  }

  ul li[data-v-218bab85] {
    font-size: 0.8rem;
  }
}
 
@media (max-width: 1114px) {
  .titulo1[data-v-218bab85] {
    font-size: 3.5rem;
  }

  .table-custom[data-v-218bab85] {
    width: auto;
  }
}

@media (max-width: 767px) {
  body {
    background: #010020;
  }

  .titulo1[data-v-218bab85] {
    font-size: 3rem;
  }

  .paragrafo[data-v-218bab85] {
    font-size: 1rem;
    padding: 0rem;
  }
}

@media (max-width: 344px) {
  .titulo1[data-v-218bab85][data-v-218bab85] {
    font-size: 2.8rem;
  }
}
</style>
  