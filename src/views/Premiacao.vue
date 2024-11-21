<template>
    <div class="bg-geofotografia">
        <div class="container my-5 text-white">
            <div class="divBackground">
                <h1 class="text-center mb-4 titulo">Prêmio Brasileiro de Fotogeografia 2024/2025</h1>
                <div class="row">
                    <div class="col-12">
                        <p class="text-justify paragrafo">
                            O Prêmio Brasileiro de Fotogeografia, uma iniciativa do LAGIM (Laboratório de Geoiconografia e Multimídias) da 
                            Universidade de Brasília, é voltado para estudantes e profissionais de Geografia, incentivando a produção de imagens geográficas.
                        </p>
                    </div>
                </div>
            </div>
                <h2 class="titulo mt-4">Categorias</h2>
                <div class="row">
                    <div class="col-12 col-md-6">
                        <ul class="list-group mb-4">
                            <li class="divBackground text-white">
                                <strong>Categoria 1:</strong> Estudantes de Graduação
                                <ul>
                                    <li>1A: Foto única.</li>
                                    <li>1B: Ensaio fotogeográfico (3 fotos).</li>
                                </ul>
                            </li>
                            <li class="divBackground text-white">
                                <strong>Categoria 2:</strong> Estudantes de Pós-Graduação
                                <ul>
                                    <li>2A: Foto única.</li>
                                    <li>2B: Ensaio fotogeográfico (3 fotos).</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="col-12 col-md-6">
                    <ul class="list-group mb-4">
                        <li class="divBackground text-white">
                            <strong>Categoria 3:</strong> Profissionais Graduados
                            <ul>
                                <li>3A: Foto única.</li>
                                <li>3B: Ensaio fotogeográfico (3 fotos).</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>

            <h2 class="mt-4 titulo">Premiação</h2>
            <div class="row">
                <div class="col-12">
                    <ul class="list-group mb-4">
                        <li class="divBackground text-white">
                            Medalha LAGIM de Fotogeografia, Certificado de Participação e inclusão no e-book para os três primeiros de cada subcategoria.
                        </li>
                        <li class="divBackground text-white">Prêmios adicionais:
                            <ul>
                                <li><strong>1º Lugar:</strong> Câmera instantânea.</li>
                                <li><strong>2º Lugar:</strong> Cartão Micro-SD 64GB.</li>
                                <li><strong>3º Lugar:</strong> Tripé de 1,45m.</li>
                            </ul>
                        </li>
                        <li class="divBackground text-white">
                            Certificado de Participação para os classificados até o 10º lugar.
                        </li>
                    </ul>
                </div>
            </div>

            <div class="container-fluid background2">
                <h2 class="mt-4 titulo">Cronograma</h2>
                <div class="row">
                    <div class="col-12">
                        <div class="table-responsive">
                            <table class="table table-bordered table-dark">
                                <thead class="table-light">
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
                    </div>
                </div>

                <div class="text-center mt-5">
                    <a href="#" target="_blank" class="buttonInscrevase">
                        Acesse o Edital
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

  
  <script>
  export default {
    name: "PremiacaoPage",
  };
  </script>
  
<style scoped>
.bg-geofotografia {
    background-size: cover;
    min-height: 100vh;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.bg-geofotografia::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../assets/tim-stief-YFFGkE3y4F8-unsplash.jpg');
    background-position: top;
    opacity: 1;
    z-index: -1;
}

.titulo {
    color: greenyellow;
    font-size: 3rem;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
}

.paragrafo {
    font-size: 1.3rem;
    color: azure;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
}

.background2 {
    background: #212121;
    padding: 1rem;
    margin-bottom: -5rem;
}

.text-justify {
    text-align: justify;
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

.divBackground {
    background: #212121;
    padding: 1rem;
    border-radius: 15px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
    margin-bottom: 1rem;
}
</style>
  