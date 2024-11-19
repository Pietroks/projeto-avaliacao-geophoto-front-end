<template>
    <section class="background1">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="tituloConcurso text-center mb-4">
              <h2>Confira os Usuários Cadastrados:</h2>
            </div>
            <div class="row g-4">
              <div 
                v-for="usuario in usuarios" 
                :key="usuario.id" 
                class="col-12 col-md-6 col-lg-3 text-center"
              >
                <div class="divUsuario mt-2">
                  <p><strong>Nome: {{ usuario.name }}</strong></p>
                  <p>Categoria: {{ usuario.category }}</p>
                  <button @click="redirecionarParaVotacao(usuario.id)" class="btn btn-primary">
                    Votar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import { mapState } from "vuex";
  import { API_URL } from "@/config/config.js";
  
  export default {
    name: "ConcursoPage",
    data() {
      return {
        usuarios: [],
      };
    },
    computed: {
      ...mapState("user", ["token"]),
    },
    async created() {
      try {
        const response = await fetch(`${API_URL}/users/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.token}`,
          },
        });
        if (response.ok) {
          const usuarios = await response.json();
          usuarios.forEach((usuario) => {
            usuario.category = ["Graduado", "Pós-Graduado", "Outros"][usuario.category - 1];
          });
          this.usuarios = usuarios;
        } else {
          console.error("Erro ao carregar usuários:", response.statusText);
          alert("Erro ao carregar os usuários. Tente novamente.");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao carregar os usuários. Verifique sua conexão.");
      }
    },
    methods: {
      redirecionarParaVotacao(usuarioId) {
        this.$router.push({ name: "votacao", params: { id: usuarioId } });
      },
    },
  };
  </script>
  