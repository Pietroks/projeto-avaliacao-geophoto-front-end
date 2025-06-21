<template>
  <div class="upload-container background-votacao">
    <div class="containerCadastro">
      <h2 class="mb-4 text-center">Envio de Foto</h2>

      <form @submit.prevent="uploadPhoto" class="containerForm">
        <div class="input-group">
          <input
            id="fileInput"
            ref="fileInput"
            type="file"
            accept="image/*"
            class="form-control"
            @change="handleFileChange"
            required
          />
        </div>

        <div class="input-group">
          <select v-model="subcategory" required class="form-select">
            <option disabled value="">Selecione a categoria</option>
            <option v-if="canUploadA" value="A">Categoria A (1 imagem)</option>
            <option v-if="canUploadB" value="B">
              Categoria B (até 3 imagens)
            </option>
          </select>
        </div>

        <div class="input-group">
          <textarea
            v-model="description"
            class="form-control"
            placeholder="Descrição da foto"
            required
          ></textarea>
        </div>

        <button
          class="btn btn-success w-100"
          :disabled="isLoading || !canUpload"
        >
          {{ isLoading ? "Enviando..." : "Enviar Foto" }}
        </button>

        <p v-if="message" class="text-center mt-3">{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { API_URL } from "@/config/config.js";

export default {
  name: "UploadPage",
  data() {
    return {
      photoFile: null,
      subcategory: "",
      description: "",
      isLoading: false,
      message: "",
      photos: [],
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
    canUpload() {
      return (
        (this.subcategory === "A" && this.canUploadA) ||
        (this.subcategory === "B" && this.canUploadB)
      );
    },
  },
  methods: {
    async fetchUserPhotos() {
      const response = await fetch(
        `${API_URL}/user/images/${this.user.user_id}/`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      );
      const data = await response.json();
      this.photos = data;
    },

    handleFileChange(event) {
      this.photoFile = event.target.files[0];
    },

    async uploadPhoto() {
      if (!this.canUpload) {
        this.message = "Limite de envio atingido para esta categoria.";
        return;
      }

      this.isLoading = true;
      try {
        const formData = new FormData();
        formData.append("image", this.photoFile);
        formData.append("user_id", this.user.user_id);
        formData.append("subcategory", this.subcategory);
        formData.append("description", this.description);

        const response = await fetch(`${API_URL}/images/upload/`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        if (!response.ok) throw new Error("Erro ao enviar imagem.");

        this.message = "Imagem enviada com sucesso!";
        setTimeout(() => {
          this.$router.push("/dashboard");
        }, 1500);
      } catch (error) {
        this.message = `Erro: ${error.message}`;
      } finally {
        this.isLoading = false;
      }
    },
  },
  async created() {
    if (this.user?.user_id) {
      await this.fetchUserPhotos();
    }
  },
};
</script>

<style scoped>
.background-votacao {
  background: linear-gradient(to top, #010020, #1b013d, #2e014f, #3d025e);
  min-height: 100vh;
  padding: 4rem 1rem;
}

.containerCadastro {
  background: radial-gradient(black, transparent);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  margin: 0 auto;
  max-width: 600px;
  color: white;
}

.input-group {
  margin-bottom: 1.5rem;
}

textarea,
input,
select {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  background: #fff;
  color: #000;
}
</style>
