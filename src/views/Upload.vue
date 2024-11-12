<template>
    <div>
      <h1>Upload de Imagem</h1>
      <input type="file" @change="uploadImage" />
    </div>
  </template>
  
  <script>
  export default {
    name: 'UploadPage',
    methods: {
      uploadImage(event) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        
        // Enviar para a API
        // axios.post('/upload', formData).then(response => { ... });
      },
    },
  };
  </script>
  