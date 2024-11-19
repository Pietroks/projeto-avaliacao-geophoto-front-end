import { API_URL } from "@/config/config.js";

export default {
  namespaced: true,
  state: {
    user: null,
    isAuthenticated: false,
    token: localStorage.getItem("auth_token") || null,  // Recuperando o token do localStorage
  },
  mutations: {
    login(state, { user, token }) {
      state.user = user;
      state.isAuthenticated = true;
      state.token = token;  // Armazenando o token no estado
      localStorage.setItem("auth_token", token);  // Persistindo no localStorage
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("auth_token");  // Removendo o token do localStorage
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
      if (token) {
        // Aqui você pode fazer uma verificação adicional se o token for válido,
        // como um fetch de uma API para validar o token ou dados do usuário
        try {
          const response = await fetch(`${API_URL}/validate-token`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            commit("login", { user: data.user, token: data.token });  // Recuperando o usuário e o token
          } else {
            commit("logout"); // Se o token for inválido, faz logout
          }
        } catch (error) {
          console.error('Erro ao verificar o token', error);
          commit("logout"); // Em caso de erro, faz logout
        }
      } else {
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

