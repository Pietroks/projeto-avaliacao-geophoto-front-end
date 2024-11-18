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
                            <div class="divFotos">
                                <img :src="usuario.imagem" class="fotosImg img-fluid" alt="Foto do Usuário">
                                <div class="divUsuario mt-2">
                                    <p><strong>Nome: {{ usuario.nome }}</strong></p>
                                    <p>Categoria: {{ usuario.nivelFormacao }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { API_URL } from "@/config/config.js";

export default {
    name: "ConcursoPage",
    data() {
        return {
            usuarios: [], 
        };
    },
    async created() {
        try {
            const response = await fetch(`${API_URL}/usuarios`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                this.usuarios = await response.json();
            } else {
                console.error("Erro ao carregar usuários:", response.statusText);
                alert("Erro ao carregar os usuários. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao carregar os usuários. Verifique sua conexão.");
        }
    },
};
</script>


<style scoped>
    .tituloConcurso {
        margin-bottom: 3rem;
        font-size: 3rem;
        font-weight: 300;
    }

    .containerGeral {
        display: grid;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 3rem;
        flex-wrap: wrap;
        margin: 3rem 0;
    }

    .fotosImg {
        width: 450px; 
        height: 350px; 
        object-fit: cover; /* Garante que a imagem não distorça */
        border-radius: 15px;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .divParticipante {
        background-color: #f8f9fa;
        padding: 0.5rem;
        border-radius: 8px;
        text-align: left;
        margin: 2rem 0;
    }
</style>