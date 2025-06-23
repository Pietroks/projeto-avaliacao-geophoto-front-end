<template>
  <div class="dashboard">
    <h1 class="mb-1">Bem-vindo, {{ user?.name || "Usuário" }}</h1>
    <p class="mb-4">Email: {{ user?.email || "Não informado" }}</p>

    <div class="upload-section card shadow-sm">
      <div class="card-body">
        <h2 class="card-title mb-3">Envie suas fotos para o concurso</h2>

        <div class="d-flex justify-content-around mb-3">
          <span class="badge bg-primary"
            >Categoria A: {{ photosA.length }}/1</span
          >
          <span class="badge bg-primary"
            >Categoria B: {{ photosB.length }}/3</span
          >
        </div>

        <form @submit.prevent="uploadPhoto" v-if="canUploadA || canUploadB">
          <div class="mb-3">
            <label for="fileInput" class="form-label">Selecione a imagem</label>
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

          <div class="mb-3">
            <label for="subcategory" class="form-label">Categoria</label>
            <select
              id="subcategory"
              v-model="subcategory"
              class="form-select"
              required
            >
              <option v-if="canUploadA" value="A">
                Categoria A (Foto Individual)
              </option>
              <option v-if="canUploadB" value="B">
                Categoria B (Conjunto de Fotos)
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label for="description" class="form-label"
              >Descrição da foto</label
            >
            <textarea
              id="description"
              v-model="description"
              class="form-control"
              placeholder="Descreva sua foto aqui..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            class="btn btn-success w-100"
            :disabled="isLoading"
          >
            {{ isLoading ? "Enviando..." : "Enviar Foto" }}
          </button>
        </form>

        <div v-else class="alert alert-info mt-3">
          Você já enviou o número máximo de fotos para todas as categorias.
        </div>
      </div>
    </div>

    <div class="mt-5">
      <h3 class="mb-4">Suas Fotos Enviadas</h3>
      <div v-if="photos.length > 0" class="row g-4">
        <div
          v-for="photo in photos"
          :key="photo.image_id"
          class="col-12 col-md-6 col-lg-4"
        >
          <div class="card shadow-sm h-100">
            <img
              :src="photo.image_url || defaultImage"
              class="card-img-top"
              alt="Imagem enviada"
            />
            <div class="card-body">
              <h5 class="card-title">Categoria: {{ photo.subcategory }}</h5>
              <p class="card-text">{{ photo.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-muted">Você ainda não enviou nenhuma foto.</p>
    </div>

    <button @click="logout" class="btn btn-outline-danger mt-5 w-100">
      Sair
    </button>
  </div>
</template>

<script>
import { API_URL } from "@/config/config.js";
import defaultImage from "@/assets/default.svg";

export default {
  name: "DashboardPage",
  data() {
    return {
      photoFile: null,
      photoFiles: [],
      description: "",
      subcategory: "A",
      photos: [],
      isLoading: false,
      defaultImage,
    };
  },
  computed: {
    user() {
      return this.$store.getters["user/user"];
    },
    token() {
      return this.$store.getters["user/token"];
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
      if (this.subcategory === 'B') {
        if (files.length != 3) {
          alert("Você pode selecionar 3 imagens para a Categoria B.");
          this.$refs.fileInput.value = "";
          this.photoFiles = [];
          return;
        }
        this.photoFiles = files;
      } else {
        this.photoFile = files[0];
      }
    },
    async uploadPhoto() {
      if (!this.description || !this.subcategory) {
        alert("Preencha todos os campos.");
        return;
      }

      if (this.subcategory === "A") {
        if (!this.photoFile) {
          alert("Selecione uma imagem para a Categoria A.");
          return;
        }
        if (!this.canUploadA) {
          alert("Limite de 1 imagem da Categoria A atingido.");
          return;
        }
      }

      if (this.subcategory === "B") {
        if (!this.photoFiles || this.photoFiles.length !== 3) {
          alert("Você deve selecionar exatamente 3 imagens para a Categoria B.");
          return;
        }
        if (!this.canUploadB) {
          alert("Limite de 3 imagens da Categoria B atingido.");
          return;
        }
      }

      this.isLoading = true;

      try {
        if (this.subcategory === "A") {
          // Upload único
          const formData = new FormData();
          formData.append("image", this.photoFile);
          formData.append("user_id", this.user.user_id);
          formData.append("subcategory", this.subcategory);
          formData.append("description", this.description);

          const response = await fetch(`${API_URL}/images/upload/`, {
            method: "POST",
            body: formData,
            headers: { Authorization: `Bearer ${this.token}` },
          });

          if (!response.ok) throw new Error("Erro ao fazer upload da imagem.");
        } else {
          // Upload múltiplo (3 vezes)
          for (const file of this.photoFiles) {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("user_id", this.user.user_id);
            formData.append("subcategory", this.subcategory);
            formData.append("description", this.description);

            const response = await fetch(`${API_URL}/images/upload/`, {
              method: "POST",
              body: formData,
              headers: { Authorization: `Bearer ${this.token}` },
            });

            if (!response.ok) throw new Error("Erro ao fazer upload de uma das imagens.");
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
      this.photoFile = null;
      this.photoFiles = [];
      this.description = "";
      this.subcategory = this.canUploadA ? "A" : "B";
      this.$refs.fileInput.value = "";
    },
    logout() {
      this.$store.dispatch("user/logout");
      this.$router.push("/login");
    },
    async fetchUserPhotos() {
      if (!this.user) return;
      this.isLoading = true;

      try {
        const response = await fetch(
          `${API_URL}/user/images/${this.user.user_id}/`,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );

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
  },
  created() {
    if (this.user) this.fetchUserPhotos();
  },
  watch: {
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
  background-color: #f0f0f0;
  border-radius: 8px 8px 0 0;
}

h1 {
  font-weight: 500;
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
</style>
