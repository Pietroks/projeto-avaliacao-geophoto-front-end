<template>
  <div class="dashboard">
    <h1>Bem-vindo, {{ user?.name || 'Usuário' }}</h1>
    <p>Email: {{ user?.email || 'Não informado' }}</p>

    <div class="upload-section">
      <h2>Envie suas fotos para o concurso</h2>
      <p>Você pode enviar no máximo 3 fotos.</p>
      <p>Fotos enviadas: {{ photos.length }}/3</p>

      <form @submit.prevent="uploadPhoto" v-if="photos.length < 3">
        <input type="file" @change="handleFileChange" accept="image/*" required />
        <textarea v-model="description" placeholder="Descrição da foto" required></textarea>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Enviando...' : 'Enviar Foto' }}
        </button>
      </form>

      <div v-else>
        <p>Você já enviou o número máximo de fotos.</p>
      </div>

      <ul class="photo-list">
        <li v-for="(photo, index) in photos" :key="index">
          Foto {{ index + 1 }}: {{ photo.name }}
        </li>
      </ul>
    </div>

    <button @click="logout" class="btn btn-danger">Sair</button>
  </div>
</template>

<script>
import { API_URL } from "@/config/config";
export default {
  name: 'DashboardPage',
  data() {
    return {
      photoFile: null,
      description: '',
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
      if (!this.photoFile) {
        alert('Por favor, selecione uma foto.');
        return;
      }

      if (this.photos.length >= 3) {
        alert('Você já enviou o número máximo de fotos.');
        return;
      }
      
      this.isLoading = true;
      
      try {
        const formData = new FormData();
        formData.append('image', this.photoFile);
        formData.append('user_id', this.user.id);
        formData.append('subcategory', 'B')
        formData.append('description',this.description)

        // Envia a foto para a API 
        const response = await fetch(`${API_URL}/images/upload/`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha no upload da imagem.');
        }
        
        // Adiciona a foto à lista local após o upload
        this.photos.push({ name: this.photoFile.name });
        alert('Foto enviada com sucesso!');

        // Limpa o estado após o envio
        this.photoFile = null; 
        this.description = '';
        this.$refs.fileInput.value = '';
      } catch (error) {
        alert(`Erro: ${error.message}`);
      } finally {
        this.isLoading = false;
      }
    },
    logout() {
      this.$store.dispatch('user/logout'); // Desloga o usuário
      this.$router.push('/login'); // Redireciona para a página de login
    },
    async fetchUserPhotos() {
      const userPhotos = await fetch(...);
      this.photos = userPhotos;
    }
  },
  created() {
    this.fetchUserPhotos();
  }
};
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}
.upload-section {
  margin-top: 2rem;
  border: 1px solid #ccc;
  padding: 1.5rem;
  border-radius: 8px;
}
form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
textarea {
    width: 100%;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
}
.photo-list {
  margin-top: 1rem;
  list-style: none;
  padding: 0;
}
.photo-list li {
  margin-bottom: 0.5rem;
}
.btn-danger {
    margin-top: 2rem;
}
</style>
