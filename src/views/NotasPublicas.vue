<template>
  <section class="container py-5">
    <h2 class="text-center mb-4">Notas dos Participantes</h2>

    <div v-for="(grupoUsuarios, categoria) in usuariosAgrupados" :key="categoria" class="mb-5">
      <h3 class="mb-3">{{ categoria }}</h3>

      <div class="card p-3 shadow-sm">
        <table class="table table-bordered table-striped mb-0">
          <thead>
            <tr>
              <th>Participante</th>
              <th>Categoria A</th>
              <th>Categoria B</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in grupoUsuarios" :key="usuario.user_id">
              <td>{{ usuario.name }}</td>
              <td>{{ usuario.categoria_a_media ?? '—' }}</td>
              <td>{{ usuario.categoria_b_media ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
import { API_URL } from "@/config/config";

export default {
  name: "NotasPublicas",
  data() {
    return {
      usuarios: [],
    };
  },
  async created() {
    try {
      const res = await fetch(`${API_URL}/avaliacoes/media-por-usuario`);
      if (res.ok) {
        this.usuarios = await res.json();
      } else {
        console.error("Erro ao carregar usuários.");
      }
    } catch (err) {
      console.error("Erro na comunicação com o servidor:", err);
    }
  },
  computed: {
    usuariosAgrupados() {
      const categoriasMap = {
        "1": "Estudante de Graduação",
        "2": "Estudante de Pós-graduação",
        "3": "Graduado",
      };

      // Inicializa os grupos vazios
      const grupos = {
        "Estudante de Graduação": [],
        "Estudante de Pós-graduação": [],
        "Graduado": [],
        "Categoria Desconhecida": [],
      };

      this.usuarios.forEach((usuario) => {
        const categoriaNome = categoriasMap[usuario.user_category] || "Categoria Desconhecida";
        grupos[categoriaNome].push(usuario);
      });

      // Remove grupos vazios para não mostrar no template
      Object.keys(grupos).forEach((key) => {
        if (grupos[key].length === 0) {
          delete grupos[key];
        }
      });

      return grupos;
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 12px;
  background-color: #fff;
}

h3 {
  font-weight: 600;
  color: #2c3e50;
}

.table th,
.table td {
  vertical-align: middle;
  text-align: center;
}

.table th {
  background-color: #f7f9fc;
}

.container {
  max-width: 960px;
  margin: 0 auto;
}
</style>
