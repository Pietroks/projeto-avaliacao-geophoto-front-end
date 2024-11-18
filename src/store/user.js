export default {
  namespaced: true,
  state: {
    user: null,
    isAuthenticated: false,
    token: localStorage.getItem("auth_token") || null,  // Recuperando o token do localStorage
  },
  mutations: {
    login(state, user) {
      state.user = user;
      state.isAuthenticated = true;
      state.token = user.token;  // Armazenando o token no estado
      localStorage.setItem("auth_token", user.token);  // Persistindo no localStorage
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("auth_token");  // Removendo o token do localStorage
    },
  },
  actions: {
    login({ commit }, user) {
      commit("login", user);
    },
    logout({ commit }) {
      commit("logout");
    },
    checkLoginStatus({ commit }) {
      const token = localStorage.getItem("auth_token");
      if (token) {
        // Aqui você pode fazer uma verificação adicional se o token for válido (como um fetch de uma API para validar o token)
        commit("login", { token });  // Recuperando o usuário e o token
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
