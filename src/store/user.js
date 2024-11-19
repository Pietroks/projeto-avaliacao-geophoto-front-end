import { API_URL } from "@/config/config.js";

export default {
  namespaced: true,
  state: {
    user: null,
    isAuthenticated: false,
    token: localStorage.getItem("auth_token") || null, // Recuperando o token do localStorage
  },
  mutations: {
    login(state, { user, token }) {
      state.user = user;
      state.isAuthenticated = true;
      state.token = token; // Armazenando o token no estado
      localStorage.setItem("auth_token", token); // Persistindo no localStorage
      console.log("Usuário logado:", user);
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("auth_token"); // Removendo o token do localStorage
      console.log("Usuário deslogado");
    },
  },
  actions: {
    login({ commit }, { user, token }) {
      commit("login", { user, token });
    },
    logout({ commit }) {
      commit("logout");
    },
    async checkLoginStatus({ commit }) {
      const token = localStorage.getItem("auth_token");
      console.log("Verificando token:", token);
      if (token) {
        try {
          const response = await fetch(`${API_URL}/validate-token`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            const data = await response.json();
            console.log("Token válido, usuário:", data.user);
            commit("login", { user: data.user, token });
          } else {
            console.warn("Token inválido. Fazendo logout...");
            commit("logout");
          }
        } catch (error) {
          console.error("Erro ao validar token:", error);
          commit("logout");
        }
      } else {
        console.log("Nenhum token encontrado. Fazendo logout...");
        commit("logout");
      }
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    user: (state) => state.user,
    token: (state) => state.token,
  },
};
