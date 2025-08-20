<template>
  <Notification :visible="notification.visible" :message="notification.message" :type="notification.type" @close="hideNotification" />

  <section class="hero-section">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-xl-10 col-lg-11 text-center">
          <div class="hero-card">
            <h1 class="titulo-principal">III Prêmio Brasileiro de Fotogeografia 2025</h1>

            <div class="tema-chip">
              <span>Tema Oficial:</span>
              <strong>Geopatrimônio e Geoconservação</strong>
            </div>

            <p class="paragrafo-principal mt-3">
              Iniciativa do LAGIM/UnB para estimular a produção de imagens geográficas por estudantes e profissionais de Geografia. Mostre
              sua leitura visual do território e concorra a prêmios!
            </p>

            <router-link to="/cadastro" class="cta-hero">
              Inscreva-se agora
              <font-awesome-icon icon="arrow-right" class="ms-2" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="conteudo-section">
    <div class="container py-5">
      <div class="row g-4 mb-5 align-items-stretch">
        <div class="col-lg-5">
          <h3 class="titulo-secao">Categorias & Subcategorias</h3>
          <p class="paragrafo-secao">
            Três categorias (Graduação, Pós-Graduação e Profissionais), cada uma com duas subcategorias:
            <em>Foto Única</em> (A) e <em>Ensaio Fotogeográfico</em> (B).
          </p>
        </div>

        <div class="col-lg-7">
          <div class="acordeao-container">
            <div class="acordeao-item" v-for="sub in subcategorias" :key="sub.titulo">
              <div class="subcat-card" @click="toggleGaveta(sub)" :class="{ ativo: gavetaAberta === sub.titulo }">
                <h5>{{ sub.titulo }}</h5>
                <p>{{ sub.desc }}</p>
              </div>

              <transition name="slide-fade">
                <div v-if="gavetaAberta === sub.titulo" class="gaveta-conteudo">
                  <h6 class="mb-3">Requisitos:</h6>
                  <ul>
                    <li v-for="(req, idx) in sub.requisitos" :key="idx">{{ req }}</li>
                  </ul>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-5">
        <div class="col-12">
          <div class="premios-card">
            <h3 class="titulo-secao text-center mb-3">Premiação</h3>
            <ul class="lista-premios">
              <li>🏅 Medalha LAGIM de Fotogeografia</li>
              <li>📜 Certificado de Participação</li>
              <li>📚 Inclusão no e-book (3 primeiros de cada subcategoria)</li>
            </ul>
            <div class="prize-grid mt-3">
              <div class="prize-item"><strong>🥇 1º Lugar:</strong> Câmera instantânea</div>
              <div class="prize-item"><strong>🥈 2º Lugar:</strong> Cartão Micro-SD 128GB</div>
              <div class="prize-item"><strong>🥉 3º Lugar:</strong> Tripé de 1,45 m</div>
            </div>
            <p class="nota-ate10 text-center mt-3">Certificado para os classificados até o 10º lugar em cada subcategoria.</p>
          </div>
        </div>
      </div>

      <div class="divInscricao">
        <h3 class="titulo-secao">Inscrições</h3>
        <p class="paragrafo-secao">
          Período: <strong>30/08/2025 a 10/10/2025</strong>. Participação individual, somente para maiores de 18 anos. Envie até
          <strong>4 fotos</strong> conforme o edital.
        </p>
        <router-link to="/cadastro" class="cta-btn">
          Fazer inscrição
          <font-awesome-icon icon="arrow-right" class="ms-2" />
        </router-link>
        <p class="paragrafo-secao importanteParagrafo">
          <strong>Importante:</strong> Envie apenas obras autorais. Consulte o edital para requisitos técnicos e de submissão.
        </p>
      </div>

      <div class="row justify-content-center mb-5">
        <div class="col-lg-10">
          <h2 class="titulo-cronograma">Critérios de Avaliação (100 pts)</h2>
          <div class="table-responsive">
            <table class="table table-custom">
              <thead>
                <tr>
                  <th>Critério</th>
                  <th>Pontuação</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Relevância</td>
                  <td>0–20</td>
                  <td>Aderência ao tema e profundidade geográfica.</td>
                </tr>
                <tr>
                  <td>Divulgação</td>
                  <td>0–20</td>
                  <td>Potencial comunicativo e de socialização do conhecimento.</td>
                </tr>
                <tr>
                  <td>Educação</td>
                  <td>0–20</td>
                  <td>Caráter formativo e contribuição didático-pedagógica.</td>
                </tr>
                <tr>
                  <td>Articulação</td>
                  <td>0–20</td>
                  <td>Coerência entre título, texto e imagem(ens).</td>
                </tr>
                <tr>
                  <td>Estética</td>
                  <td>0–20</td>
                  <td>Composição, técnica e originalidade.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-lg-10">
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
                  <td>25/08/2025</td>
                </tr>
                <tr>
                  <td>Período de inscrições</td>
                  <td>30/08/2025 a 10/10/2025</td>
                </tr>
                <tr>
                  <td>Avaliação</td>
                  <td>11/10/2025 a 16/10/2025</td>
                </tr>
                <tr>
                  <td>Reunião da comissão</td>
                  <td>17 e 18/10/2025</td>
                </tr>
                <tr>
                  <td>Divulgação do resultado</td>
                  <td>20/10/2025</td>
                </tr>
                <tr>
                  <td>Envio dos prêmios</td>
                  <td>Até 31/10/2025</td>
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

      <div v-if="modalAberto" class="modal-overlay" @click.self="fecharModal">
        <div class="modal-card">
          <button class="modal-close" @click="fecharModal">&times;</button>
          <h4 class="mb-3">{{ modalConteudo.titulo }}</h4>
          <ul>
            <li v-for="(req, idx) in modalConteudo.requisitos" :key="idx">{{ req }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <Footer />
</template>

<script>
import Footer from "@/components/Footer.vue";
import Notification from "@/components/Notification.vue";

export default {
  name: "PremiacaoPage",
  components: { Footer, Notification },
  data() {
    return {
      gavetaAberta: false,
      isDownloading: false,
      notification: {
        visible: false,
        message: "",
        type: "info",
      },
      subcategorias: [
        {
          titulo: "1A · Graduação – Foto Única",
          desc: "Uma fotografia que sintetize o tema.",
          requisitos: [
            "Até 1 foto autoral inédita.",
            "Formato: JPG ou PNG.",
            "Dimensão mínima: 3000px no lado maior.",
            "Resolução mínima: 300 DPI.",
            "Até 10 MB por arquivo.",
          ],
        },
        {
          titulo: "1B · Graduação – Ensaio",
          desc: "Série coesa de até 3–5 imagens com narrativa.",
          requisitos: [
            "De 3 a 5 fotos autorais inéditas.",
            "Formato: JPG ou PNG.",
            "Dimensão mínima: 3000px no lado maior.",
            "Resolução mínima: 300 DPI.",
            "Até 10 MB por arquivo.",
          ],
        },
        {
          titulo: "2A · Pós-Graduação – Foto Única",
          desc: "Registro singular com força conceitual e técnica.",
          requisitos: [
            "Até 1 foto autoral inédita.",
            "Formato: JPG ou PNG.",
            "Dimensão mínima: 3000px no lado maior.",
            "Resolução mínima: 300 DPI.",
            "Até 10 MB por arquivo.",
          ],
        },
        {
          titulo: "2B · Pós-Graduação – Ensaio",
          desc: "Sequência que articule tema, lugar e tempo.",
          requisitos: [
            "De 3 a 5 fotos autorais inéditas.",
            "Formato: JPG ou PNG.",
            "Dimensão mínima: 3000px no lado maior.",
            "Resolução mínima: 300 DPI.",
            "Até 10 MB por arquivo.",
          ],
        },
        {
          titulo: "3A · Profissionais – Foto Única",
          desc: "Imagem autoral de forte leitura geográfica.",
          requisitos: [
            "Até 1 foto autoral inédita.",
            "Formato: JPG ou PNG.",
            "Dimensão mínima: 3000px no lado maior.",
            "Resolução mínima: 300 DPI.",
            "Até 10 MB por arquivo.",
          ],
        },
        {
          titulo: "3B · Profissionais – Ensaio",
          desc: "Conjunto com unidade estética e narrativa.",
          requisitos: [
            "De 3 a 5 fotos autorais inéditas.",
            "Formato: JPG ou PNG.",
            "Dimensão mínima: 3000px no lado maior.",
            "Resolução mínima: 300 DPI.",
            "Até 10 MB por arquivo.",
          ],
        },
      ],
    };
  },
  methods: {
    showNotification(message, type = "info", duration = 5000) {
      this.notification.message = message;
      this.notification.type = type;
      this.notification.visible = true;

      setTimeout(() => {
        this.hideNotification();
      }, duration);
    },
    hideNotification() {
      this.notification.visible = false;
    },

    baixarEditalPDF() {
      const urlPDF = "/Edital III Premio Fotogeografia.pdf";
      const nomeArquivo = "Edital III Premio Fotogeografia.pdf";

      this.isDownloading = true;

      try {
        const a = document.createElement("a");
        a.href = urlPDF;
        a.download = nomeArquivo;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (e) {
        console.error(e);
        this.showNotification("Ocorreu um erro ao tentar baixar o edital.");
      } finally {
        setTimeout(() => {
          this.isDownloading = false;
        }, 500);
      }
    },

    toggleGaveta(sub) {
      if (this.gavetaAberta === sub.titulo) {
        this.gavetaAberta = null;
      } else {
        this.gavetaAberta = sub.titulo;
      }
    },
  },
};
</script>

<style scoped>
.hero-section {
  background: url("../assets/hex6.webp") no-repeat center center / cover fixed;
  color: #0c2a3d;
}
.hero-card {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  padding: 2.5rem;
  border-radius: 22px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(19, 122, 190, 0.15);
}
.titulo-principal {
  font-size: clamp(1.8rem, 3.2vw, 3.2rem);
  color: #137abe;
  font-weight: 800;
  letter-spacing: 0.2px;
  margin-bottom: 0.75rem;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
}
.tema-chip {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  background: linear-gradient(90deg, #e9f4ff, #fff);
  border: 1px solid rgba(19, 122, 190, 0.25);
  color: #0a2b45;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(19, 122, 190, 0.15);
}
.cta-hero {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.8rem 1.4rem;
  border-radius: 12px;
  background: #137abe;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  box-shadow: 0 10px 22px rgba(19, 122, 190, 0.32);
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s;
}
.cta-hero:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 14px 28px rgba(19, 122, 190, 0.4);
  filter: saturate(1.05);
}

/* ====== CONTEÚDO BASE ====== */
.conteudo-section {
  background: #0e0e0f;
  color: #f5f7fa;
}

/* Títulos & Texto */
.titulo-secao {
  font-size: clamp(1.3rem, 2.2vw, 2rem);
  color: #66b4e6;
  font-weight: 700;
}
.paragrafo-secao {
  font-size: 1.05rem;
  color: #e3e8ee;
  opacity: 0.95;
}

/* ====== SUBCATEGORIAS ====== */
.subcats-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
.subcat-card {
  background: linear-gradient(180deg, #1d242b, #1a1f25);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
.subcat-card h5 {
  margin: 0 0 0.25rem;
  font-weight: 700;
  color: #bfe2ff;
}
.subcat-card p {
  margin: 0;
  color: #b9c4cf;
}

/* ====== PREMIAÇÃO ====== */
.premios-card {
  background: linear-gradient(180deg, #19222b, #141b22);
  border: 1px solid rgba(102, 180, 230, 0.2);
  padding: 2rem;
  border-radius: 18px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}
.lista-premios {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
  color: #d9e7f3;
}
.prize-grid {
  display: grid;
  gap: 0.75rem;
  margin-top: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
.prize-item {
  background: #222a33;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  color: #e5eff8;
  text-align: center;
}
.nota-ate10 {
  color: #b6c7d6;
}

/* ====== INSCRIÇÃO (CTA CAIXA) ====== */
.divInscricao {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
  margin: 2.25rem auto 3rem;
  width: min(760px, 92%);
  text-align: center;
}
.cta-btn {
  display: inline-block;
  background: #137abe;
  color: #fff;
  text-decoration: none;
  padding: 0.85rem 1.4rem;
  font-weight: 800;
  border-radius: 12px;
  margin: 0.75rem 0 0;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s;
  box-shadow: 0 10px 24px rgba(19, 122, 190, 0.35);
}
.cta-btn:hover {
  background: #0d5f93;
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(19, 122, 190, 0.45);
}

.importanteParagrafo {
  font-size: 0.9rem;
  font-style: italic;
  color: #a3afba;
}

/* ====== TABELAS ====== */
.titulo-cronograma {
  font-size: clamp(1.4rem, 2.4vw, 2.2rem);
  text-align: center;
  color: #66b4e6;
  font-weight: 800;
  margin-bottom: 1.2rem;
}
.table-custom {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  overflow: hidden;
}
.table-custom th,
.table-custom td {
  padding: 1rem 1.2rem;
  text-align: center;
  font-size: 1rem;
  vertical-align: middle;
}
.table-custom th {
  background: #0d2a49;
  color: #eaf6ff;
  font-weight: 700;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
}
.table-custom td {
  background: #1f2630;
  color: #e8f2fa;
}
.table-custom tbody tr:last-child td:first-child {
  border-bottom-left-radius: 14px;
}
.table-custom tbody tr:last-child td:last-child {
  border-bottom-right-radius: 14px;
}
.table-custom tbody tr {
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.table-custom tbody tr:hover {
  transform: scale(1.01);
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.38);
}

/* ====== BOTÃO EDITAL ====== */
.button-edital {
  display: inline-block;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 800;
  background: #0d2a49;
  padding: 0.9rem 2rem;
  border-radius: 14px;
  border: none;
  box-shadow: 0 10px 24px rgba(13, 42, 73, 0.45);
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s;
}
.button-edital:hover {
  background: #137abe;
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(19, 122, 190, 0.45);
}

/* Estilos para gaveta */
.acordeao-container {
  display: grid;
  gap: 1rem;
}

.subcat-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
}

.subcat-card.ativo,
.subcat-card:hover {
  border-color: #017d8b;
  background-color: #f8f9fa;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.gaveta-conteudo {
  padding: 1rem;
  background-color: inherit;
  border: 1px solid #e0e0e0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  margin-top: -8px;
}

.gaveta-conteudo ul {
  padding-left: 1.2rem;
  margin-bottom: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
/* ====== RESPONSIVO ====== */
@media (max-width: 767px) {
  .hero-card {
    padding: 1.5rem;
  }
  .paragrafo-principal {
    font-size: 1.05rem;
  }
}
</style>
