<template>
  <div class="dashboard">
    <ImageModal :visible="isModalVisible" :images="modalImages" :start-index="modalStartIndex" @close="isModalVisible = false" />

    <h1 class="mb-1">Bem-vindo, {{ user?.name || "Usuário" }}</h1>
    <p class="mb-4">Email: {{ user?.email || "Não informado" }}</p>

    <div class="account-actions mb-4 d-flex justify-content-between">
      <button @click="goToUpdatePassword" class="btn btn-outline-secondary">Alterar Senha</button>

      <router-link to="/admin" v-if="isAvaliador" class="btn btn-info ms-2">
        Administração <font-awesome-icon icon="arrow-right" />
      </router-link>
    </div>

    <div v-if="!isAvaliador">
      <div class="upload-section card shadow-sm">
        <div class="card-body">
          <h2 class="card-title mb-3">Envie suas fotos para o concurso</h2>

          <div class="d-flex justify-content-around mb-3">
            <span class="badge bg-primary">Categoria A: {{ photosA.length }}/1</span>
            <span class="badge bg-primary">Categoria B: {{ photosB.length }}/3</span>
          </div>

          <form @submit.prevent="uploadPhotos" v-if="canUploadA || canUploadB" :key="`form-${photosA.length}-${photosB.length}`">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="fileInput" class="form-label">Selecione a(s) imagem(ns)</label>
                <input
                  id="fileInput"
                  ref="fileInput"
                  type="file"
                  class="form-control"
                  @change="handleFileChange"
                  accept="image/jpeg, image/jpg"
                  :multiple="subcategory === 'B'"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label for="subcategory" class="form-label">Categoria</label>
                <select
                  id="subcategory"
                  v-model="subcategory"
                  class="form-select"
                  required
                  :key="`sel-${canUploadA}-${canUploadB}-${photosA.length}-${photosB.length}`"
                >
                  <option v-if="canUploadA" value="A">Categoria A (1 Foto Individual)</option>
                  <option v-if="canUploadB" value="B">Categoria B (Conjunto de 3 Fotos)</option>
                </select>
              </div>
            </div>

            <div v-if="photoFiles.length > 1" class="d-flex justify-content-center gap-2 mb-3">
              <img v-for="(file, index) in photoFiles" :key="index" :src="getPreviewUrl(file)" class="photo-preview-small" alt="Preview" />
            </div>

            <div v-if="photoFiles.length > 0" class="mt-4">
              <h4 class="mb-3">Detalhes da Foto / Conjunto</h4>
              <div class="photo-details-form">
                <input v-model="nomeFoto" type="text" class="form-control mb-2" placeholder="Nome da Foto / Conjunto *" required />
                <input v-model="localFoto" type="text" class="form-control mb-2" placeholder="Local da Foto *" required />
                <input v-model="equipamentoFoto" type="text" class="form-control mb-2" placeholder="Equipamento Utilizado *" required />
                <textarea
                  v-model="descricaoFoto"
                  class="form-control"
                  placeholder="Descrição (até 1500 caracteres) *"
                  maxlength="1500"
                  rows="4"
                  required
                ></textarea>
              </div>
            </div>

            <button type="submit" class="btn btn-success w-100 mt-4" :disabled="isLoading || photoFiles.length === 0">
              {{ isLoading ? "Enviando..." : "Enviar Foto(s)" }}
            </button>
          </form>

          <div v-else class="alert alert-info mt-3">Você já enviou o número máximo de fotos para todas as categorias.</div>
        </div>
      </div>

      <div class="mt-5">
        <h3 class="mb-4">Suas Fotos Enviadas</h3>

        <div v-if="photosA.length > 0">
          <h4 class="mb-3">Categoria A</h4>
          <div class="row g-4">
            <div v-for="photo in photosA" :key="photo.image_id" class="col-12 col-md-6 col-lg-4">
              <div class="card shadow-sm h-100">
                <img
                  :src="photo.image_url || defaultImage"
                  class="card-img-top clickable-image"
                  alt="Imagem enviada"
                  @click="openModal(photosA, 0)"
                />
                <div class="card-body">
                  <h5 class="card-title mb-4">{{ photo.title }}</h5>
                  <h6 v-if="photo.place" class="card-subtitle mb-2 text-muted"><strong>Local:</strong> {{ photo.place }}</h6>
                  <p class="card-text mb-2 text-muted"><strong>Equipamento:</strong> {{ photo.equipment || "N/A" }}</p>
                  <p class="card-text mb-2 text-muted"><strong>Descrição:</strong> {{ photo.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="photosB.length > 0" class="mt-5">
          <h4 class="mb-3">Categoria B</h4>
          <div class="card card-body bg-light mb-4 text-dark">
            <h5><strong>Nome do Conjunto:</strong> {{ photosB[0].title || "Não informado" }}</h5>
            <p class="mb-1"><strong>Local:</strong> {{ photosB[0].place || "Não informado" }}</p>
            <p class="mb-0"><strong>Equipamento:</strong> {{ photosB[0].equipment || "Não informado" }}</p>
            <p class="mt-2 mb-0"><strong>Descrição do Conjunto:</strong> {{ photosB[0].description }}</p>
          </div>
          <div class="row g-4">
            <div v-for="(photo, index) in photosB" :key="photo.image_id" class="col-12 col-md-6 col-lg-4">
              <div class="card shadow-sm h-100">
                <img
                  :src="photo.image_url || defaultImage"
                  class="card-img-top clickable-image"
                  alt="Imagem enviada"
                  @click="openModal(photosB, index)"
                />
              </div>
            </div>
          </div>
        </div>

        <p v-if="photos.length === 0" class="text-muted">Você ainda não enviou nenhuma foto.</p>
      </div>
    </div>

    <div v-else>
      <div class="admin-panel card shadow-sm">
        <div class="card-body">
          <h2 class="card-title mb-3">Painel do Avaliador</h2>
          <p class="text-muted">Aqui você pode acompanhar as avaliações que já realizou.</p>
          <button @click="gerarRelatorioPDF" class="btn btn-success" :disabled="isLoading">
            {{ isLoading ? "Gerando..." : "Baixar Relatório de Notas (PDF)" }}
          </button>
        </div>
      </div>
    </div>

    <div class="text-center">
      <button @click="logout" class="btn btn-outline-danger mt-5 w-50">Sair</button>
    </div>
  </div>
</template>

<script>
import { API_URL } from "@/config/config.js";
import defaultImage from "@/assets/default.svg";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ImageModal from "@/components/ImageModal.vue";

export default {
  name: "DashboardPage",
  components: { FontAwesomeIcon, ImageModal },
  data() {
    return {
      photoFiles: [],
      nomeFoto: "",
      localFoto: "",
      equipamentoFoto: "",
      descricaoFoto: "",
      subcategory: "A",
      photos: [],
      isLoading: false,
      defaultImage,
      avaliacoes: [],
      isModalVisible: false,
      modalImages: [],
      modalStartIndex: 0,
    };
  },
  computed: {
    user() {
      return this.$store.getters["user/user"];
    },
    token() {
      return this.$store.getters["user/token"];
    },
    isAvaliador() {
      return this.user && (this.user.user_type === "A" || this.user.user_type === "E");
    },
    photosA() {
      return this.photos.filter(
        (p) =>
          String(p.subcategory ?? p.category ?? "")
            .trim()
            .toUpperCase() === "A"
      );
    },
    photosB() {
      return this.photos.filter(
        (p) =>
          String(p.subcategory ?? p.category ?? "")
            .trim()
            .toUpperCase() === "B"
      );
    },
    canUploadA() {
      return this.photosA.length < 1;
    },
    canUploadB() {
      return this.photosB.length < 3;
    },
  },
  methods: {
    openModal(images, index) {
      this.modalImages = images;
      this.modalStartIndex = index;
      this.isModalVisible = true;
    },

    handleFileChange(event) {
      const files = Array.from(event.target.files);

      const invalidFiles = files.filter((f) => !["image/jpeg", "image/jpg"].includes(f.type));
      if (invalidFiles.length > 0) {
        alert("Formato inválido. Só é permitido enviar imagens JPEG/JPG.");
        this.resetFileInput();
        return;
      }

      if (this.subcategory === "B" && files.length !== 3) {
        alert("Você deve selecionar exatamente 3 imagens para a Categoria B.");
        this.resetFileInput();
        return;
      }
      this.photoFiles = files;
    },
    async uploadPhotos() {
      if (!this.nomeFoto?.trim() || !this.localFoto?.trim() || !this.equipamentoFoto?.trim() || !this.descricaoFoto?.trim()) {
        alert("Por favor, preencha todos os detalhes da foto/conjunto.");
        return;
      }

      this.isLoading = true;

      try {
        for (const file of this.photoFiles) {
          console.log("Enviando:", file);

          const formData = new FormData();
          formData.append("image", file);
          formData.append("user_id", this.user.user_id);
          formData.append("subcategory", this.subcategory);
          formData.append("title", this.nomeFoto);
          formData.append("place", this.localFoto);
          formData.append("equipment", this.equipamentoFoto);
          formData.append("description", this.descricaoFoto);

          for (let [k, v] of formData.entries()) {
            console.log(k, v);
          }

          const response = await fetch(`${API_URL}/images/upload/`, {
            method: "POST",
            body: formData,
            headers: { Authorization: `Bearer ${this.token}` },
          });

          if (!response.ok) {
            if (file.type !== "image/jpeg" && file.type !== "image/jpg") {
              throw new Error(`Formato não suportado (${file.type}). Apenas JPEG/JPG são aceitos.`);
            }
            throw new Error(`Erro ao fazer upload da imagem: ${file.name}`);
          }
        }

        alert("Foto(s) enviada(s) com sucesso!");
        this.resetForm();
        await this.fetchUserPhotos();
      } catch (error) {
        alert(`Erro: ${error.message}`);
      } finally {
        this.isLoading = false;
      }
    },
    resetForm() {
      this.photoFiles = [];
      this.nomeFoto = "";
      this.localFoto = "";
      this.equipamentoFoto = "";
      this.descricaoFoto = "";

      if (this.canUploadA) {
        this.subcategory = "A";
      } else if (this.canUploadB) {
        this.subcategory = "B";
      } else {
        this.subcategory = "";
      }
      this.resetFileInput();
    },

    resetFileInput() {
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
    getPreviewUrl(file) {
      return URL.createObjectURL(file);
    },

    logout() {
      this.$store.dispatch("user/logout");
      this.$router.push("/login");
    },

    async fetchUserPhotos() {
      if (!this.user) return;
      this.isLoading = true;

      try {
        const response = await fetch(`${API_URL}/user/images/${this.user.user_id}/`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        if (response.status === 404) {
          this.photos = [];
          return;
        }

        if (!response.ok) {
          if (response.status === 401) this.logout();
          throw new Error("Erro ao buscar imagens.");
        }

        const { images } = await response.json();

        const fotosDetalhadas = await Promise.all(
          images.map(async (image) => {
            const detalhesResponse = await fetch(`${API_URL}/images/${image.image_id}/details`, {
              headers: { Authorization: `Bearer ${this.token}` },
            });

            let detalhes = {};
            if (detalhesResponse.ok) {
              detalhes = await detalhesResponse.json();
            }

            return {
              ...image,
              ...detalhes,
              image_url: `${API_URL}/images/${image.image_id}/`,
            };
          })
        );

        this.photos = fotosDetalhadas;
      } catch (error) {
        console.error("Erro ao buscar imagens:", error);
        this.photos = [];
      } finally {
        this.isLoading = false;
      }
    },

    goToUpdatePassword() {
      if (this.user && this.user.user_id) {
        this.$router.push(`/edit-profile/${this.user.user_id}`);
      } else {
        console.error("ID do usuário não encontrado para navegação.");
        alert("Não foi possível encontrar suas informações para alterar a senha.");
      }
    },

    async gerarRelatorioPDF() {
      this.isLoading = true;
      try {
        const response = await fetch(`${API_URL}/avaliacoes/media-por-usuario`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        if (!response.ok) {
          throw new Error("Não foi possível gerar o relatório. Verifique se há avaliações concluídas.");
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/pdf")) {
          throw new Error("A resposta do servidor não foi um arquivo PDF. Contate o administrador.");
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", "relatorio_avaliacoes.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error("Erro ao baixar o relatório:", error);
        alert(error.message);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAvaliacoes() {
      if (!this.user || !this.user.user_id) return;
      this.isLoading = true;
      try {
        const response = await fetch(`${API_URL}/avaliacoes/media-por-usuario`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        if (!response.ok) {
          if (response.status === 404) this.avaliacoes = [];
          else throw new Error("Erro ao buscar avaliações.");
          return;
        }

        // VERIFICAÇÃO ADICIONADA AQUI
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Erro: A resposta do servidor não é JSON. É provável que seja um PDF.");
          this.avaliacoes = []; // Define como vazio para evitar quebrar a página
          return;
        }

        const data = await response.json();

        this.avaliacoes = data.map((item) => ({
          id: item.user_id,
          nome: item.image_title,
          autor: item.user_name,
          notaMedia: parseFloat(item.average_score).toFixed(2),
          image_url: `${API_URL}/images/${item.image_id}/`,
        }));
      } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
        this.avaliacoes = [];
      } finally {
        this.isLoading = false;
      }
    },
  },
  created() {
    if (this.isAvaliador) {
      this.fetchAvaliacoes();
    } else if (this.user) {
      this.fetchUserPhotos();
    }
  },
  watch: {
    canUploadA(newVal) {
      if (!newVal && this.subcategory === "A") {
        this.subcategory = this.canUploadB ? "B" : "";
      }
    },
    canUploadB(newVal) {
      if (!newVal && this.subcategory === "B") {
        this.subcategory = this.canUploadA ? "A" : "";
      }
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 960px;
  margin: 0 auto;
}
.card-img-top {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.card {
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}
.photo-details-form {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}
.photo-preview-small {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.admin-panel .card-body {
  background-color: #e9f5ff;
  border: 1px solid #b8d6f0;
  border-radius: 8px;
}

.clickable-image {
  cursor: pointer;
}
</style>
