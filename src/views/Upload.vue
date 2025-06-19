<template>
  <div class="upload-container">
    <h2 class="mb-4">Envio de Foto</h2>

    <form @submit.prevent="uploadPhoto">
      <div class="mb-3">
        <label for="fileInput" class="form-label">Selecione a imagem</label>
        <input
          id="fileInput"
          ref="fileInput"
          type="file"
          class="form-control"
          accept="image/*"
          @change="handleFileChange"
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
          <option value="A">Categoria A (Foto Individual)</option>
          <option value="B">Categoria B (Conjunto de Fotos)</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Descrição da foto</label>
        <textarea
          id="description"
          v-model="description"
          class="form-control"
          placeholder="Descreva sua foto aqui..."
          required
        ></textarea>
      </div>

      <button class="btn btn-success w-100" :disabled="isLoading">
        {{ isLoading ? "Enviando..." : "Enviar Foto" }}
      </button>
    </form>

    <p v-if="message" class="mt-3 text-center">{{ message }}</p>
  </div>
</template>

<script>
import { API_URL } from "@/config/config.js";

export default {
  name: "UploadPage",
  data() {
    return {
      photoFile: null,
      subcategory: "A",
      description: "",
      isLoading: false,
      message: "",
    };
  },
  computed: {
    user() {
      return this.$store.getters["user/user"];
    },
    token() {
      return this.$store.getters["user/token"];
    },
  },
  methods: {
    handleFileChange(event) {
      this.photoFile = event.target.files[0];
    },

    async uploadPhoto() {
      if (!this.photoFile || !this.subcategory || !this.description) {
        this.message = "Preencha todos os campos antes de enviar.";
        return;
      }

      this.isLoading = true;

      try {
        const formData = new FormData();
        formData.append("image", this.photoFile);
        formData.append("user_id", this.user.id);
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
        this.resetForm();
      } catch (error) {
        this.message = `Erro: ${error.message}`;
      } finally {
        this.isLoading = false;
      }
    },

    resetForm() {
      this.photoFile = null;
      this.description = "";
      this.subcategory = "A";
      this.$refs.fileInput.value = "";
    },
  },
};
</script>

<style scoped>
.upload-container {
  max-width: 500px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

h2 {
  font-weight: 500;
  text-align: center;
}

input[type="file"],
select,
textarea,
button {
  width: 100%;
}
</style>
