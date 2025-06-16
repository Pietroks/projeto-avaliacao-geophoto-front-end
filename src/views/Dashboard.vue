<template>
  <div class="dashboard">
    <h1>Bem-vindo, {{ user?.name || 'Usuário' }}</h1>
    <p>Email: {{ user?.email || 'Não informado' }}</p>

    <div class="upload-section">
      <h2>Envie suas fotos para o concurso</h2>
      <p>Você pode enviar no máximo 3 fotos.</p>
      <p>Fotos enviadas: {{ photos.length }}/3</p>

      <form @submit.prevent="uploadPhoto" v-if="photos.length < 3">
        <input type="file" @change="handleFileChange" />
        <button type="submit">Enviar Foto</button>
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
  computed: {
    user() {
      return this.$store.getters['user/user']; // Obtém o usuário autenticado do Vuex Store
    },
  },
  data() {
    return {
      photoFile: null, // Para armazenar o arquivo selecionado
      photos: [], // Lista de fotos enviadas
    };
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

      try {
        const formData = new FormData();
        formData.append('image', this.photoFile);
        formData.append('user_id', this.user.id);
        formData.append('subcategory', 'B')
        formData.append('description','teste de envio')

        // Envia a foto para a API (substitua a URL abaixo pelo endpoint real)
        await fetch(`${API_URL}/images/upload/`, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${this.$store.getters['user/token']}`,
          },
        });

        // Adiciona a foto à lista local após o upload
        this.photos.push({
          name: this.photoFile.name,
          file: this.photoFile,
        });

        alert('Foto enviada com sucesso!');
        this.photoFile = null; // Limpa o estado após o envio
      } catch (error) {
        alert('Erro ao enviar foto. Tente novamente.');
      }
    },
    logout() {
      this.$store.dispatch('user/logout'); // Desloga o usuário
      this.$router.push('/login'); // Redireciona para a página de login
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}
.upload-section {
  margin-top: 2rem;
}
.photo-list {
  margin-top: 1rem;
  list-style: none;
  padding: 0;
}
.photo-list li {
  margin-bottom: 0.5rem;
}
</style>
