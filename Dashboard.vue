<template>
  <div class="background1">
    <div class="dashboard">
      <ImageModal
        :visible="isImageModalVisible"
        :images="modalImages"
        :start-index="modalStartIndex"
        @close="isImageModalVisible = false"
      />
      <Modal
        v-model="isModalVisible"
        :title="modal.title"
        :message="modal.message"
        :buttonText="modal.buttonText"
        :type="modal.type"
        @confirm="handleModalConfirm"
      />

      <h1 class="mb-1">Bem-vindo, {{ user?.name || "Usuário" }}</h1>
      <p class="mb-4">Email: {{ user?.email || "Não informado" }}</p>

      <div class="account-actions mb-4 d-flex justify-content-between">
        <button @click="goToUpdatePassword" class="btn btn-outline-secondary">Alterar Senha</button>

        <router-link to="/admin" v-if="isAvaliador" class="btn btn-info ms-2">
          Administração <font-awesome-icon icon="arrow-right" />
        </router-link>
      </div>

      <div v-if="!isAvaliador">
        <div class="upload-section card shadow-sm mb-5">
          <div class="card-body">
            <h2 class="card-title mb-3">Envie suas fotos para o concurso</h2>

            <div class="d-flex justify-content-around mb-3">
              <span class="badge bg-primary fs-6">Categoria A: {{ photosA.length }}/1</span>
              <span class="badge bg-primary fs-6">Categoria B: {{ photosB.length }}/3</span>
            </div>

            <form @submit.prevent="uploadPhotos" v-if="canUploadA || canUploadB" :key="`form-${photosA.length}-${photosB.length}`">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="subcategory" class="form-label fw-bold">Categoria</label>
                  <select id="subcategory" v-model="subcategory" class="form-select" required>
                    <option v-if="canUploadA" value="A">Categoria A (1 Foto Individual)</option>
                    <option v-if="canUploadB" value="B">Categoria B (Conjunto de até 3 Fotos)</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="fileInput" class="form-label fw-bold">Selecione a(s) imagem(ns)</label>
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
              </div>

              <div v-if="photoFiles.length > 0" class="d-flex justify-content-center flex-wrap gap-2 my-3">
                <img
                  v-for="(file, index) in photoFiles"
                  :key="index"
                  :src="getPreviewUrl(file)"
                  class="photo-preview-small"
                  alt="Pré-visualização da imagem"
                />
              </div>

              <div v-if="photoFiles.length > 0" class="mt-4">
                <h4 class="mb-3">Detalhes da Foto / Conjunto</h4>
                <div class="photo-details-form">
                  <input
                    v-model="nomeFoto"
                    type="text"
                    class="form-control mb-2"
                    placeholder="Nome da Foto / Conjunto *"
                    required
                    :disabled="isDadosConjuntoBDisabled"
                  />
                  <input
                    v-model="localFoto"
                    type="text"
                    class="form-control mb-2"
                    placeholder="Local da Foto *"
                    required
                    :disabled="isDadosConjuntoBDisabled"
                  />
                  <input
                    v-model="equipamentoFoto"
                    type="text"
                    class="form-control mb-2"
                    placeholder="Equipamento Utilizado *"
                    required
                    :disabled="isDadosConjuntoBDisabled"
                  />
                  <textarea
                    v-model="descricaoFoto"
                    class="form-control"
                    placeholder="Descrição (até 1500 caracteres) *"
                    maxlength="1500"
                    rows="4"
                    required
                    :disabled="isDadosConjuntoBDisabled"
                  ></textarea>
                </div>
              </div>

              <button type="submit" class="btn btn-success w-100 mt-4" :disabled="isLoading || photoFiles.length === 0">
                <span v-if="isLoading">
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Enviando...
                </span>
                <span v-else>Enviar Foto(s)</span>
              </button>
            </form>

            <div v-else class="alert alert-info mt-3">
              Você já enviou o número máximo de fotos para todas as categorias.<br />Aguarde o resultado no dia 20/10/2025.
            </div>
          </div>
        </div>

        <div>
          <h3 class="mb-4">Suas Fotos Enviadas</h3>

          <div v-if="photosA.length > 0">
            <h4 class="mb-3">Categoria A</h4>
            <div class="row g-4">
              <div v-for="(photo, index) in photosA" :key="photo.image_id" class="col-12 col-md-6 col-lg-4">
                <div class="card shadow-sm h-100">
                  <img
                    :src="photo.image_url || defaultImage"
                    class="card-img-top clickable-image"
                    alt="Imagem enviada"
                    @click="openImageModal(photosA, index)"
                  />
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title mb-3">{{ photo.title }}</h5>
                    <p class="card-text text-muted mb-2"><strong>Local:</strong> {{ photo.place || "N/A" }}</p>
                    <p class="card-text text-muted mb-2"><strong>Equipamento:</strong> {{ photo.equipment || "N/A" }}</p>
                    <p class="card-text text-muted small mt-auto"><strong>Descrição:</strong> {{ photo.description }}</p>
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
              <p class="mb-1"><strong>Equipamento:</strong> {{ photosB[0].equipment || "Não informado" }}</p>
              <p class="mt-2 mb-0"><strong>Descrição do Conjunto:</strong> {{ photosB[0].description }}</p>
            </div>
            <div class="row g-4">
              <div v-for="(photo, index) in photosB" :key="photo.image_id" class="col-12 col-md-6 col-lg-4">
                <div class="card shadow-sm h-100">
                  <img
                    :src="photo.image_url || defaultImage"
                    class="card-img-top clickable-image"
                    alt="Imagem enviada"
                    @click="openImageModal(photosB, index)"
                  />
                </div>
              </div>
            </div>
          </div>

          <p v-if="!photosA.length && !photosB.length" class="text-muted mt-4">Você ainda não enviou nenhuma foto.</p>
        </div>
      </div>

      <div v-else>
        <div class="admin-panel card shadow-sm">
          <div class="card-body">
            <h2 class="card-title mb-3">Painel do Avaliador</h2>
            <p class="text-muted">Aqui você pode acompanhar as avaliações que já realizou.</p>
            <button @click="gerarRelatorioPDF" class="btn btn-primary" :disabled="isLoading">
              <span v-if="isLoading">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Gerando...
              </span>
              <span v-else>Baixar Relatório de Notas (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      <div class="text-center">
        <button @click="logout" class="btn btn-outline-danger mt-5 w-50">Sair</button>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URL } from "@/config/config.js";
import defaultImage from "@/assets/default.svg";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ImageModal from "@/components/ImageModal.vue";
import Modal from "@/components/Modal.vue";

export default {
  name: "DashboardPage",
  components: { FontAwesomeIcon, ImageModal, Modal },
  data() {
    return {
      photoFiles: [],
      nomeFoto: "",
      localFoto: "",
      equipamentoFoto: "",
      descricaoFoto: "",
      subcategory: "",
      photos: [],
      isLoading: false,
      defaultImage,
      isImageModalVisible: false,
      modalImages: [],
      modalStartIndex: 0,
      isModalVisible: false,
      modal: {
        title: "",
        message: "",
        buttonText: "OK",
        type: "info",
        action: null,
      },
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
    isDadosConjuntoBDisabled() {
      return this.subcategory === "B" && this.photosB.length > 0;
    },
  },
  methods: {
    showAlert(title, message, type = "info", buttonText = "OK", action = null) {
      this.modal.title = title;
      this.modal.message = message;
      this.modal.type = type;
      this.modal.buttonText = buttonText;
      this.modal.action = action;
      this.isModalVisible = true;
    },

    handleModalConfirm() {
      if (typeof this.modal.action === "function") {
        this.modal.action();
      }
      this.isModalVisible = false;
    },

    openImageModal(images, index) {
      this.modalImages = images.map((img) => ({ ...img, title: img.title || this.photosB[0]?.title }));
      this.modalStartIndex = index;
      this.isImageModalVisible = true;
    },

    handleFileChange(event) {
      const files = Array.from(event.target.files);

      if (files.some((f) => !["image/jpeg", "image/jpg"].includes(f.type))) {
        this.showAlert("Formato Inválido", "Apenas imagens no formato JPEG/JPG são permitidas.", "error");
        this.resetFileInput();
        return;
      }

      if (this.subcategory === "A" && files.length > 1) {
        this.showAlert("Limite Excedido", "Você pode selecionar apenas 1 imagem para a Categoria A.", "warning");
        this.resetFileInput();
        return;
      }

      if (this.subcategory === "B") {
        const vagasRestantes = 3 - this.photosB.length;
        if (files.length > vagasRestantes) {
          this.showAlert("Limite Excedido", `Você só pode enviar mais ${vagasRestantes} foto(s) para a Categoria B.`, "warning");
          this.resetFileInput();
          return;
        }
      }

      this.photoFiles = files;
    },

    async uploadPhotos() {
      if (!this.nomeFoto?.trim() || !this.localFoto?.trim() || !this.equipamentoFoto?.trim() || !this.descricaoFoto?.trim()) {
        this.showAlert("Campos Obrigatórios", "Por favor, preencha todos os detalhes da foto/conjunto.", "warning");
        return;
      }

      this.isLoading = true;

      try {
        const uploadPromises = this.photoFiles.map((file) => {
          const formData = new FormData();
          formData.append("image", file);
          formData.append("user_id", this.user.user_id);
          formData.append("subcategory", this.subcategory);
          formData.append("title", this.nomeFoto);
          formData.append("place", this.localFoto);
          formData.append("equipment", this.equipamentoFoto);
          formData.append("description", this.descricaoFoto);

          return fetch(`${API_URL}/images/upload/`, {
            method: "POST",
            body: formData,
            headers: { Authorization: `Bearer ${this.token}` },
          });
        });

        const responses = await Promise.all(uploadPromises);

        const failedUploads = responses.filter((res) => !res.ok);
        if (failedUploads.length > 0) {
          throw new Error(`Erro ao enviar ${failedUploads.length} imagem(ns). Por favor, tente novamente.`);
        }

        this.showAlert("Sucesso!", "Foto(s) enviada(s) com sucesso!", "success");
        await this.fetchUserPhotos();
        this.resetForm();
      } catch (error) {
        this.showAlert("Erro no Envio", error.message, "error");
      } finally {
        this.isLoading = false;
      }
    },

    resetForm() {
      this.photoFiles = [];
      this.resetFileInput();

      if (!this.isDadosConjuntoBDisabled) {
        this.nomeFoto = "";
        this.localFoto = "";
        this.equipamentoFoto = "";
        this.descricaoFoto = "";
      }

      this.setDefaultSubcategory();
    },

    resetFileInput() {
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },

    setDefaultSubcategory() {
      if (this.canUploadA) {
        this.subcategory = "A";
      } else if (this.canUploadB) {
        this.subcategory = "B";
      } else {
        this.subcategory = "";
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
      if (!this.user?.user_id) return;
      this.isLoading = true;

      try {
        const response = await fetch(`${API_URL}/user/images/${this.user.user_id}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        if (response.status === 404) {
          this.photos = [];
          return;
        }
        if (!response.ok) {
          if (response.status === 401) this.logout();
          throw new Error("Erro ao buscar suas imagens.");
        }

        const data = await response.json();
        const images = data.images || [];

        // Otimização: Busca detalhes em paralelo
        const detailedPhotosPromises = images.map(async (image) => {
          try {
            const detailsResponse = await fetch(`${API_URL}/images/${image.image_id}/details`, {
              headers: { Authorization: `Bearer ${this.token}` },
            });
            const details = detailsResponse.ok ? await detailsResponse.json() : {};
            return {
              ...image,
              ...details,
              image_url: `${API_URL}/images/${image.image_id}/`,
            };
          } catch {
            return {
              ...image,
              image_url: `${API_URL}/images/${image.image_id}/`,
            };
          }
        });

        this.photos = await Promise.all(detailedPhotosPromises);

        if (this.photosB.length > 0 && this.canUploadB) {
          const firstPhotoOfSet = this.photosB[0];
          this.nomeFoto = firstPhotoOfSet.title;
          this.localFoto = firstPhotoOfSet.place;
          this.equipamentoFoto = firstPhotoOfSet.equipment;
          this.descricaoFoto = firstPhotoOfSet.description;
        }
      } catch (error) {
        console.error("Erro ao buscar imagens:", error);
        this.showAlert("Erro", "Não foi possível carregar suas fotos.", "error");
        this.photos = [];
      } finally {
        this.isLoading = false;
      }
    },

    goToUpdatePassword() {
      if (this.user?.user_id) {
        this.$router.push(`/edit-profile/${this.user.user_id}`);
      } else {
        this.showAlert("Erro", "ID do usuário não encontrado para alterar a senha.", "error");
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
        if (!contentType?.includes("application/pdf")) {
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
        this.showAlert("Erro ao Gerar Relatório", error.message, "error");
      } finally {
        this.isLoading = false;
      }
    },
  },

  async created() {
    if (!this.isAvaliador && this.user) {
      await this.fetchUserPhotos();
      this.setDefaultSubcategory();
    }
  },

  watch: {
    photos() {
      if (!this.isAvaliador) {
        this.setDefaultSubcategory();
      }
    },
  },
};
</script>

<style scoped>
.background1 {
  height: 86.7vh;
}

.dashboard {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f8f9fa;
  background-image: url("/src/assets/tinyWebp/hex5.webp");
  border-radius: 8px;
}

.upload-section,
.admin-panel {
  background-color: #fff;
  border: 1px solid #dee2e6;
  padding: 1.5rem;
  border-radius: 8px;
}

.clickable-image {
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s;
  object-fit: cover;
  aspect-ratio: 4 / 3;
}

.clickable-image:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.photo-preview-small {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>
