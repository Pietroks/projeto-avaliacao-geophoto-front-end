<template>
  <div class="dashboard">
    <h1 class="mb-1">Bem-vindo, {{ user?.name || "Usuário" }}</h1>
    <p class="mb-4">Email: {{ user?.email || "Não informado" }}</p>

    <div class="account-actions mb-4">
      <button @click="goToUpdatePassword" class="btn btn-outline-secondary">Alterar Senha</button>

      <button v-if="isAvaliador" @click="gerarRelatorioPDF" class="btn btn-info ms-2">Gerar Relatório PDF</button>

      <router-link to="/admin" v-if="isAvaliador" class="cta-btn">
        Administração <font-awesome-icon icon="arrow-right" class="ms-2" />
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

          <form @submit.prevent="uploadPhotos" v-if="canUploadA || canUploadB">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="fileInput" class="form-label">Selecione a(s) imagem(ns)</label>
                <input
                  id="fileInput"
                  ref="fileInput"
                  type="file"
                  class="form-control"
                  @change="handleFileChange"
                  accept="image/*"
                  :multiple="subcategory === 'B'"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label for="subcategory" class="form-label">Categoria</label>
                <select id="subcategory" v-model="subcategory" class="form-select" required>
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
        <div v-if="photos.length > 0" class="row g-4">
          <div v-for="photo in photos" :key="photo.image_id" class="col-12 col-md-6 col-lg-4">
            <div class="card shadow-sm h-100">
              <img :src="photo.image_url || defaultImage" class="card-img-top" alt="Imagem enviada" />
              <div class="card-body">
                <h5 class="card-title">{{ photo.nome || `Categoria: ${photo.subcategory}` }}</h5>
                <h6 v-if="photo.local" class="card-subtitle mb-2 text-muted">{{ photo.local }}</h6>
                <p class="card-text"><strong>Equipamento:</strong> {{ photo.equipamento || "N/A" }}</p>
                <p class="card-text">{{ photo.description }}</p>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-muted">Você ainda não enviou nenhuma foto.</p>
      </div>
    </div>

    <div v-else>
      <div class="admin-panel card shadow-sm">
        <div class="card-body">
          <h2 class="card-title mb-3">Painel do Avaliador</h2>
          <p class="text-muted">Aqui você pode acompanhar as avaliações que já realizou.</p>
        </div>
      </div>

      <div class="mt-5">
        <h3 class="mb-4">Minhas Avaliações</h3>
        <div v-if="avaliacoes.length > 0" class="row g-4">
          <div v-for="avaliacao in avaliacoes" :key="avaliacao.id" class="col-12 col-md-6 col-lg-4">
            <div class="card shadow-sm h-100">
              <img :src="avaliacao.image_url || defaultImage" class="card-img-top" alt="Imagem avaliada" />
              <div class="card-body">
                <h5 class="card-title">{{ avaliacao.nome }}</h5>
                <p class="card-text"><strong>Concorrente:</strong> {{ avaliacao.autor }}</p>
                <p class="card-text"><strong>Sua Nota Média:</strong> {{ avaliacao.notaMedia }}</p>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-muted">Você ainda não avaliou nenhuma foto.</p>
      </div>
    </div>

    <button @click="logout" class="btn btn-outline-danger mt-5 w-100">Sair</button>
  </div>
</template>

<script>
import { API_URL } from "@/config/config.js";
import defaultImage from "@/assets/default.svg";

export default {
  name: "DashboardPage",
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
      return this.photos.filter((p) => p.subcategory === "A");
    },
    photosB() {
      return this.photos.filter((p) => p.subcategory === "B");
    },
    canUploadA() {
      return this.photosA.length < 1;
    },
    canUploadB() {
      return this.photosB.length < 3;
    },
  },
  methods: {
    handleFileChange(event) {
      const files = Array.from(event.target.files);
      if (this.subcategory === "B" && files.length !== 3) {
        alert("Você deve selecionar exatamente 3 imagens para a Categoria B.");
        this.resetFileInput();
        return;
      }
      this.photoFiles = files;
    },
    async uploadPhotos() {
      if (!this.nomeFoto || !this.localFoto || !this.equipamentoFoto || !this.descricaoFoto) {
        alert("Por favor, preencha todos os detalhes da foto/conjunto.");
        return;
      }

      this.isLoading = true;

      try {
        for (const file of this.photoFiles) {
          const formData = new FormData();
          formData.append("image", file);
          formData.append("user_id", this.user.user_id);
          formData.append("subcategory", this.subcategory);
          formData.append("nome", this.nomeFoto);
          formData.append("local", this.localFoto);
          formData.append("equipamento", this.equipamentoFoto);
          formData.append("description", this.descricaoFoto);

          const response = await fetch(`${API_URL}/images/upload/`, {
            method: "POST",
            body: formData,
            headers: { Authorization: `Bearer ${this.token}` },
          });

          if (!response.ok) {
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
      this.subcategory = this.canUploadA ? "A" : "B";
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

        if (response.status == 401) {
          this.logout();
        }
        if (!response.ok) throw new Error("Erro ao buscar imagens.");

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

    gerarRelatorioPDF() {
      alert("Lógica para gerar o PDF no backend ainda não foi implementada.");
    },

    async fetchAvaliacoes() {
      if (!this.user) return;
      this.isLoading = true;
      try {
        const response = await fetch(`${API_URL}/evaluators/${this.user.user_id}/ratings`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        if (!response.ok) throw new Error("Erro ao buscar avaliações.");
        const data = await response.json();
        this.avaliacoes = data;
      } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
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
    subcategory() {
      this.resetForm();
    },
    canUploadA(newVal) {
      if (!newVal && this.subcategory === "A") {
        this.subcategory = "B";
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
</style>
