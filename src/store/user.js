import { API_URL } from "@/config/config";

export default {
  namespaced: true,
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem("authToken") || null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user))
    },
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("authToken", token);
    },
    LOGOUT(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    },
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        const response = await fetch(`${API_URL}/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) throw new Error("Credenciais inválidas!");

        const data = await response.json();
        console.log(data)
        commit("SET_USER", data.user);
        commit("SET_TOKEN", data.token);

        return data;
      } catch (error) {
        throw new Error(error.message || "Erro ao realizar login.");
      }
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.token;
    },
    user: (state) => state.user,
    token: (state) => state.token,
    isAvaliador: (state) => state.user && state.user.user_type === 'A'
  },
};