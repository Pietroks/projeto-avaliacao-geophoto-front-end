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
                                    <p v-if="isLoggedIn">
                                        <button @click="votar(usuario.id)" class="btn btn-primary">Votar</button>
                                    </p>
                                    <p v-else>
                                        <strong>Faça login para votar!</strong>
                                    </p>
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
        isLoggedIn() {
            return !!this.token;
        },
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
    methods: {
        async votar(usuarioId) {
            if (this.isLoggedIn) {
                try {
                    const response = await fetch(`${API_URL}/usuarios/${usuarioId}/votar`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${this.token}`, // Enviar o token no header para autenticação
                        },
                        body: JSON.stringify({
                            voto: 5, // O valor do voto pode ser dinâmico, ajustado conforme necessidade
                        }),
                    });

                    if (response.ok) {
                        alert("Voto registrado com sucesso!");
                    } else {
                        console.error("Erro ao registrar voto:", response.statusText);
                        alert("Erro ao registrar voto. Tente novamente.");
                    }
                } catch (error) {
                    console.error("Erro na requisição:", error);
                    alert("Erro ao registrar voto. Verifique sua conexão.");
                }
            } else {
                alert("Você precisa estar logado para votar.");
            }
        },
    },
};
</script>

<style scoped>
    .tituloConcurso {
        margin-bottom: 3rem;
        font-size: 3rem;
        font-weight: 300;
    }

    .fotosImg {
        width: 450px;
        height: 350px;
        object-fit: cover;
        border-radius: 15px;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .divUsuario {
        background-color: #f8f9fa;
        padding: 0.5rem;
        border-radius: 8px;
        text-align: left;
        margin: 2rem 0;
    }

    .btn {
        margin-top: 10px;
    }
</style>
