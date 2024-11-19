<template>
    <div class="dashboard">
      <h1>Bem-vindo, {{ user?.name || 'Usuário' }}</h1>
      <p>Email: {{ user?.email || 'Não informado' }}</p>
  
      <div class="upload-section">
        <h2>Envie suas fotos para o concurso</h2>
        <form @submit.prevent="uploadPhoto">
          <input type="file" @change="handleFileChange" />
          <button type="submit">Enviar Foto</button>
        </form>
      </div>
  
      <button @click="logout" class="btn btn-danger">Sair</button>
    </div>
  </template>
  
  <script>
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
  
        // Simula envio da foto para uma API
        try {
          const formData = new FormData();
          formData.append('photo', this.photoFile);
          formData.append('userId', this.user.id);
  
          // Envia a foto para a API (substitua a URL abaixo pelo endpoint real)
          await fetch('/api/photos/upload', {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer ${this.$store.getters['user/token']}`,
            },
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
  </style>
  