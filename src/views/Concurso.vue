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
                <img :src="usuario.image" alt="Imagem do usuário" class="img-fluid rounded shadow-lg mb-3">
                <p><strong>Nome: {{ usuario.name }}</strong></p>
                <p>Categoria: {{ usuario.category }}</p>
                <button 
                  @click="redirecionarParaVotacao(usuario.id)" 
                  class="btn btn-primary"
                >
                  Imagens
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

<style scoped>
.background1 {
  background-color: #010020;
  padding: 4rem 0;
}

.tituloConcurso h2 {
  color: #a52a2a;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  background: transparent;
}

.divUsuario {
  background: #222;
  border-radius: 15px;
  padding: 1rem;
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.divUsuario:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

.divUsuario img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.btn-primary {
  background-color: #137ABE;
  border-color: #137ABE;
  margin-top: 1rem;
  font-size: 1rem;
  border-radius: 12px;
  padding: 0.5rem 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: 0.3s ease-in-out;
}

.btn-primary:hover {
  background-color: #1e5f8e;
  border-color: #1e5f8e;
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

@media (max-width: 767px) {
  .divUsuario img {
    max-height: 250px;
  }
}
</style>
  