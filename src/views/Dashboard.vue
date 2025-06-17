<template>
  <div class="dashboard">
    <h1>Bem-vindo, {{ user?.name || 'Usuário' }}</h1>
    <p>Email: {{ user?.email || 'Não informado' }}</p>

    <div class="upload-section card">
      <div class="card-body">
        <h2 class="card-title">Envie suas fotos para o concurso</h2>
        <p class="card-text">Você pode enviar no máximo 3 fotos. | Enviadas: {{ photos.length }}/3</p>

        <form @submit.prevent="uploadPhoto" v-if="photos.length < 3">
          <div class="mb-3">
            <label for="fileInput" class="form-label">Selecione a imagem</label>
            <input id="fileInput" ref="fileInput" type="file" @change="handleFileChange" class="form-control" accept="image/*" required />
          </div>

          <div class="mb-3">
            <label for="subcategory" class="form-label">Categoria</label>
            <select id="subcategory" v-model="subcategory" class="form-select" required>
              <option value="A">Categoria A (Foto Individual)</option>
              <option value="B">Categoria B (Conjunto de Fotos)</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="description" class="form-label">Descrição da foto</label>
            <textarea id="description" v-model="description" class="form-control" placeholder="Descreva sua foto aqui..." required></textarea>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Enviando...' : 'Enviar Foto' }}
          </button>
        </form>

        <div v-else class="alert alert-info">
          Você já enviou o número máximo de fotos permitidas.
        </div>
      </div>
    </div>

    <div class="mt-4">
      <h3>Suas Fotos Enviadas</h3>
      <div v-if="photos.length > 0" class="row g-4">
        <div v-for="photo in photos" :key="photo.image_id" class="col-12 col-md-6 col-lg-4">
            <div class="card">
                <img :src="photo.image_url" class="card-img-top" alt="Imagem enviada">
                <div class="card-body">
                    <h5 class="card-title">Categoria: {{ photo.subcategory }}</h5>
                    <p class="card-text">{{ photo.description }}</p>
                </div>
            </div>
        </div>
      </div>
      <p v-else>Você ainda não enviou nenhuma foto.</p>
    </div>

    <button @click="logout" class="btn btn-danger mt-4">Sair</button>
  </div>
</template>

<script>
import { API_URL } from "@/config/config.js";

export default {
  name: 'DashboardPage',
  data() {
    return {
      photoFile: null,
      description: '',
      subcategory: 'A', 
      photos: [],
      isLoading: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters['user/user'];
    },
    token() {
      return this.$store.getters['user/token'];
    }
  },
  methods: {
    handleFileChange(event) {
      this.photoFile = event.target.files[0];
    },
    async uploadPhoto() {
      if (!this.photoFile || !this.description || !this.subcategory) {
        alert('Por favor, preencha todos os campos.');
        return;
      }
      this.isLoading = true;

      try {
        const formData = new FormData();
        formData.append('image', this.photoFile);
        formData.append('user_id', this.user.id);
        formData.append('subcategory', this.subcategory);
        formData.append('description', this.description);

        const response = await fetch(`${API_URL}/images/upload/`, {
          method: 'POST',
          body: formData,
          headers: { 'Authorization': `Bearer ${this.token}` },
        });

        if (!response.ok) {
          throw new Error('Falha no upload da imagem.');
        }

        alert('Foto enviada com sucesso!');
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
        this.description = '';
        this.subcategory = 'A';
        this.$refs.fileInput.value = '';
    },
    logout() {
      this.$store.dispatch('user/logout');
      this.$router.push('/login');
    },
    async fetchUserPhotos() {
      if (!this.user) return; 

      this.isLoading = true;
      try {
        const response = await fetch(`${API_URL}/user/images/${this.user.id}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${this.token}` },
        });

        if (response.ok) {
          const data = await response.json();
          this.photos = data.images.map(image => ({
            ...image,
            image_url: `${API_URL}/images/${image.image_id}/`
          }));
        } else {
          console.error("Erro ao buscar as fotos do usuário:", response.statusText);
        }
      } catch (error) {
        console.error("Erro na requisição das fotos:", error);
      } finally {
        this.isLoading = false;
      }
    }
  },
  created() {
    if (this.user) {
      this.fetchUserPhotos();
    }
  },
};
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}
.upload-section.card {
  margin-top: 2rem;
}
.photo-list {
  margin-top: 1rem;
  list-style: none;
  padding: 0;
}
.card-img-top {
    width: 100%;
    height: 200px;
    object-fit: cover;
}
</style>
