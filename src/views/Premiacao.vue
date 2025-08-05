<template>
  <section class="hero-section">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8 text-center">
          <div class="hero-card">
            <h1 class="titulo-principal">Prêmio Brasileiro de Geofotografia 2025</h1>
            <p class="paragrafo-principal">
              O Prêmio Brasileiro de Geofotografia, uma iniciativa do LAGIM (Laboratório de Geoiconografia e Multimídias) da Universidade de
              Brasília, é voltado para estudantes e profissionais de Geografia, incentivando a produção de imagens geográficas.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="conteudo-section">
    <div class="container py-5">
      <div class="row mb-5">
        <div class="col-md-6 mb-4">
          <h3 class="titulo-secao">Categorias</h3>
          <p class="paragrafo-secao">O Prêmio Brasileiro de Geofotografia tem as seguintes categorias:</p>
          <ul>
            <li>Categoria 1: Estudantes de Graduação</li>
            <li>Categoria 2: Estudantes de Pós-Graduação</li>
            <li>Categoria 3: Profissionais Graduados</li>
          </ul>
        </div>
        <div class="col-md-6 mb-4">
          <h3 class="titulo-secao">Premiação</h3>
          <p class="paragrafo-secao">A premiação inclui:</p>
          <ul>
            <li>Medalha LAGIM de Geofotografia</li>
            <li>Certificado de Participação</li>
            <li>Inclusão no e-book para os três primeiros de cada subcategoria</li>
            <li><strong>1º Lugar:</strong> Câmera instantânea</li>
            <li><strong>2º Lugar:</strong> Cartão Micro-SD 64GB</li>
            <li><strong>3º Lugar:</strong> Tripé de 1,45m</li>
            <li>Certificado de Participação para os classificados até o 10º lugar</li>
          </ul>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h2 class="titulo-cronograma">Cronograma</h2>
          <div class="table-responsive">
            <table class="table table-custom">
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
          <div class="text-center mt-4">
            <button class="button-edital" @click="baixarEditalPDF" :disabled="isDownloading">
              {{ isDownloading ? "Baixando..." : "Acesse o Edital" }}
            </button>
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
  name: "PremiacaoPage", // Nome do componente para boas práticas
  components: {
    Footer,
  },
  data() {
    return {
      isDownloading: false, // Variável reativa para controlar o estado do botão
    };
  },
  methods: {
    async baixarEditalPDF() {
      // Quando o backend estiver pronto, substitua esta URL pela URL real da sua API
      const urlBackend = "/api/baixar-edital"; // URL de exemplo
      const nomeArquivo = "Edital_Geofotografia_2025.pdf"; // Nome padrão do arquivo

      this.isDownloading = true;

      try {
        const response = await fetch(urlBackend);

        if (!response.ok) {
          throw new Error(`Erro no servidor: ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = nomeArquivo;
        document.body.appendChild(a);

        a.click();

        window.URL.revokeObjectURL(url);
        a.remove();
      } catch (error) {
        console.error("Erro ao baixar o edital:", error);
        // Em um app real, você poderia usar um toast ou notificação mais elegante
        alert("Desculpe, não foi possível baixar o edital no momento. Tente novamente mais tarde.");
      } finally {
        this.isDownloading = false;
      }
    },
  },
};
</script>

<style scoped>
.hero-section {
  background: url("../assets/hex6.png") no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  color: black;
}

.hero-card {
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);
}

.titulo-principal {
  font-size: 2.5rem;
  color: #137abe;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.paragrafo-principal {
  font-size: 1.2rem;
  line-height: 1.7;
}

.conteudo-section {
  background-color: #111;
  color: whitesmoke;
}

.titulo-secao {
  font-size: 2rem;
  color: #137abe;
  font-weight: 600;
  margin-bottom: 1rem;
}

.paragrafo-secao {
  font-size: 1.1rem;
}

ul {
  list-style-position: inside;
  padding-left: 0;
}

ul li {
  font-size: 1rem;
  line-height: 1.8;
}

.table-responsive {
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.titulo-cronograma {
  font-size: 2.5rem;
  text-align: center;
  color: #137abe;
  margin-bottom: 2rem;
  font-weight: 700;
}

.table-custom {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.table-custom th,
.table-custom td {
  padding: 1.25rem;
  text-align: center;
  font-size: 1.1rem;
  vertical-align: middle;
}

.table-custom th {
  background-color: #00214b;
  color: white;
  font-weight: 600;
}

.table-custom td {
  background-color: #2a2a2a;
  color: whitesmoke;
}

.table-custom thead th:first-child {
  border-top-left-radius: 15px;
}
.table-custom thead th:last-child {
  border-top-right-radius: 15px;
}
.table-custom tbody tr:last-child td:first-child {
  border-bottom-left-radius: 15px;
}
.table-custom tbody tr:last-child td:last-child {
  border-bottom-right-radius: 15px;
}

.table-custom tbody tr {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.table-custom tbody tr:hover {
  transform: scale(1.02);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
}

.button-edital {
  display: inline-block;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  background-color: #00214b;
  padding: 0.8rem 2.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
  text-decoration: none;
  margin: 2rem 0;
  border: none;
}

.button-edital:hover {
  background-color: #137abe;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(19, 122, 190, 0.4);
}

/* --- AJUSTES DE RESPONSIVIDADE --- */
@media (max-width: 767px) {
  .titulo-principal {
    font-size: 2rem;
  }
  .paragrafo-principal {
    font-size: 1.1rem;
  }
}
</style>
