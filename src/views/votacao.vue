<template>
  <section class="background1">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="tituloConcurso text-center mb-4">
            <h2>Imagens de {{ usuario.name }}</h2>
          </div>

          <!-- Categoria A -->
          <div class="categoria">
            <h3 class="text-center mb-3">Categoria A</h3>
            <div v-if="imagensA.length > 0" class="row g-4">
              <div
                v-for="image in imagensA"
                :key="image.image_id"
                class="col-12 col-md-6 col-lg-3"
              >
                <img
                  :src="image.image_url"
                  class="fotosImg"
                  alt="Imagem do usuário"
                  @click="ampliarImagem(image)"
                />
                <p>{{ image.description }}</p>

                <div v-if="isAvaliador">
                  <label for="notas">Notas:</label>
                  <div>
                    <input
                      v-for="(nota, index) in image.notas"
                      :key="index"
                      v-model.number="image.notas[index]"
                      type="number"
                      min="0"
                      max="20"
                      :placeholder="'Quesito ' + (index + 1)"
                    />
                  </div>
                  <p><strong>Média:</strong> {{ calcularMedia(image.notas) }}</p>
                  <button @click="enviarNota(image, 'A')">Enviar Notas</button>
                </div>
              </div>
            </div>
            <p v-else>Não há imagens na Categoria A.</p>
          </div>

          <!-- Categoria B -->
          <div class="categoria">
            <h3 class="text-center mb-3">Categoria B</h3>
            <div v-if="imagensB.length > 0" class="row g-4">
              <div
                v-for="image in imagensB"
                :key="image.image_id"
                class="col-12 col-md-6 col-lg-3"
              >
                <img
                  :src="image.image_url"
                  class="fotosImg"
                  alt="Imagem do usuário"
                  @click="ampliarImagem(image)"
                />
                <p>{{ image.description }}</p>

                <div v-if="isAvaliador">
                  <label for="notas">Notas:</label>
                  <div>
                    <input
                      v-for="(nota, index) in image.notas"
                      :key="index"
                      v-model.number="image.notas[index]"
                      type="number"
                      min="0"
                      max="20"
                      :placeholder="'Quesito ' + (index + 1)"
                    />
                  </div>
                  <p><strong>Média:</strong> {{ calcularMedia(image.notas) }}</p>
                  <button @click="enviarNota(image, 'B')">Enviar Notas</button>
                </div>
              </div>
            </div>
            <p v-else>Não há imagens na Categoria B.</p>
          </div>
        </div>
      </div>

      <!-- Modal para Ampliação da Imagem -->
      <div v-if="imagemAmpliada" class="modal" @click.self="fecharModal">
        <img :src="imagemAmpliada.image_url" class="imagemAmpliada" />
        <p>{{ imagemAmpliada.description }}</p>
        <button @click="fecharModal">Fechar</button>
      </div>
    </div>
  </section>
</template>

<script>
import { API_URL } from "@/config/config.js";

export default {
  name: "VotacaoPage",
  data() {
    return {
      usuario: {},
      imagensA: [],
      imagensB: [],
      imagemAmpliada: null, // Imagem atualmente ampliada no modal
    };
  },
  computed: {
    isAvaliador() {
      return this.$store.getters["user/isAvaliador"];
    },
    token() {
      return this.$store.getters["user/token"];
    },
  },
  methods: {
    ampliarImagem(image) {
      this.imagemAmpliada = image; // Define a imagem para exibição no modal
    },
    fecharModal() {
      this.imagemAmpliada = null; // Fecha o modal
    },
    calcularMedia(notas) {
      if (!notas || notas.length === 0) return 0;
      const soma = notas.reduce((total, nota) => total + nota, 0);
      return (soma / notas.length).toFixed(2);
    },
    async enviarNota(image, categoria) {
      try {
        const user_id = this.usuario.id;
        const endpoint = `${API_URL}/images/${image.image_id}/rate/`;
        const media = this.calcularMedia(image.notas);
        const body = {
          image_id: image.image_id,
          rating: media,
          user_id: user_id,
          categoria,
        };

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          alert("Nota enviada com sucesso!");
        } else {
          console.error("Erro ao enviar nota:", response.statusText);
          alert("Erro ao enviar nota.");
        }
      } catch (error) {
        console.error("Erro ao enviar nota:", error);
        alert("Erro ao enviar nota. Verifique sua conexão.");
      }
    },
  },
  async created() {
    const usuarioId = this.$route.params.id;
    try {
      const response = await fetch(`${API_URL}/users/${usuarioId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
      if (response.ok) {
        const usuario = await response.json();
        usuario.images = await this.carregarImagensComDetalhes(usuario.id);
        this.usuario = usuario;
        this.imagensA = usuario.images.filter((img) => img.subcategory === "A");
        this.imagensB = usuario.images.filter((img) => img.subcategory === "B");

        // Adicionar 5 campos de notas para cada imagem
        [...this.imagensA, ...this.imagensB].forEach((img) => {
          img.notas = Array(5).fill(0);
        });
      } else {
        console.error("Erro ao carregar usuário:", response.statusText);
        alert("Erro ao carregar o usuário.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao carregar o usuário. Verifique sua conexão.");
    }
  },
};
</script>

<style scoped>
.background1 {
  background-color: #f9f9f9;
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.tituloConcurso h2 {
  font-size: 2rem;
  color: #333;
  font-weight: bold;
}

.categoria h3 {
  font-size: 1.8rem;
  color: #444;
  border-bottom: 2px solid #137abe;
  display: inline-block;
  padding-bottom: 5px;
  margin-bottom: 20px;
}

.fotosImg {
  width: 100%;
  height: auto;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.fotosImg:hover {
  transform: scale(1.05);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
}

.categoria label {
  font-weight: bold;
  display: block;
  margin: 10px 0 5px;
}

.categoria input[type="number"] {
  width: calc(20% - 10px);
  padding: 5px;
  margin-right: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
}

.categoria input[type="number"]:focus {
  outline: none;
  border-color: #137abe;
  box-shadow: 0px 0px 5px rgba(19, 122, 190, 0.5);
}

.categoria button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #137abe;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.categoria button:hover {
  background-color: #0f5e91;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.imagemAmpliada {
  max-width: 90%;
  max-height: 80%;
  border-radius: 8px;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.5);
}

.modal p {
  color: #fff;
  margin-top: 10px;
  text-align: center;
  font-size: 1.2rem;
}

.modal button {
  display: block;
  margin: 20px auto 0;
  padding: 10px 20px;
  background-color: #ff5555;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.modal button:hover {
  background-color: #cc4444;
}
</style>
