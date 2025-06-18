<template>
  <div class="dashboard">
    <h1>Bem-vindo, {{ user?.name || 'Usuário' }}</h1>
    <p>Email: {{ user?.email || 'Não informado' }}</p>

    <div class="upload-section card">
      <div class="card-body">
        <h2 class="card-title">Envie suas fotos para o concurso</h2>
        <div class="d-flex justify-content-around mb-3">
            <span class="badge bg-secondary">Categoria A: {{ photosA.length }}/1</span>
            <span class="badge bg-secondary">Categoria B: {{ photosB.length }}/3</span>
        </div>

        <form @submit.prevent="uploadPhoto" v-if="canUploadA || canUploadB">
          <div class="mb-3">
            <label for="fileInput" class="form-label">Selecione a imagem</label>
            <input id="fileInput" ref="fileInput" type="file" @change="handleFileChange" class="form-control" accept="image/*" required />
          </div>

          <div class="mb-3">
            <label for="subcategory" class="form-label">Categoria</label>
            <select id="subcategory" v-model="subcategory" class="form-select" required>
              <option v-if="canUploadA" value="A">Categoria A (Foto Individual)</option>
              <option v-if="canUploadB" value="B">Categoria B (Conjunto de Fotos)</option>
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
          Você já enviou o número máximo de fotos para todas as categorias.
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
    },
    photosA() {
      return this.photos.filter(p => p.subcategory === 'A');
    },
    photosB() {
      return this.photos.filter(p => p.subcategory === 'B');
    },
    canUploadA() {
      return this.photosA.length < 1;
    },
    canUploadB() {
      return this.photosB.length < 3;
    }
  },
  methods: {
    handleFileChange(event) {
      this.photoFile = event.target.files[0];
    },
    async uploadPhoto() {
      if (this.subcategory === 'A' && !this.canUploadA) {
        alert('Você já atingiu o limite de 1 foto para a Categoria A.');
        return;
      }
      if (this.subcategory === 'B' && !this.canUploadB) {
        alert('Você já atingiu o limite de 1 foto para a Categoria B.');
        return;
      }
      
      if (!this.photoFile || !this.description || !this.subcategory) {
        alert('Por favor, preencha todos os campos.');
        return;
      }
      this.isLoading = true;

      try {
        const formData = new FormData();
        formData.append('image', this.photoFile);
        formData.append('user_id', this.user.id);
        formData.append('category', this.subcategory);
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
        this.subcategory = this.canUploadA ? 'A' : 'B';
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
        const response = await fetch(`${API_URL}/user/images/${this.user.user_id}`, {
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
  watch: {
    canUploadA(newVal) {
      if (!newVal && this.subCategory === 'A') {
        this.subcategory = 'B'
      }
    }
  }
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
