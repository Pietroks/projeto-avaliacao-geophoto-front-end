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
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    },
    SET_TOKEN(state, token) {
      state.token = token;
      if (token) {
        localStorage.setItem("authToken", token);
      } else {
        localStorage.removeItem("authToken");
      }
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

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Credenciais inválidas!");
        }

        const data = await response.json();
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

// verifica o estado do login a partir do localstorage
    checkLoginStatus({ commit, state }) {
      if (state.token) {
        const user = localStorage.getItem('user');
        if (user) {
          commit('SET_USER', JSON.parse(user));
        } else {
          commit('LOGOUT');
        }
      }
    },
  },
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    user: (state) => state.user,
    token: (state) => state.token,
    isAvaliador: (state) => state.user && state.user.user_type === 'A',
    isAdmin: (state) => state.user && state.user.user_type === 'admin',  
  },
};
