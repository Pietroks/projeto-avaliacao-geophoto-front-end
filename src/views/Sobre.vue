<template>
    <div>
      <h3>SOBRE</h3>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SobrePage',
    data() {
      return {
        name: '',
        email: '',
        password: '',
      };
    },
    methods: {
      async register() {
        // Aqui você faria a requisição para o backend para cadastrar o usuário
        console.log('Cadastro:', this.name, this.email, this.password);
        this.$router.push('/login');
      },
    },
  };
  </script>
  