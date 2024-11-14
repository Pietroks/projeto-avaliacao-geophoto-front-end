export default {
  namespaced: true,
  state: {
    user: null,
    isAuthenticated: false,
  },
  mutations: {
    login(state, user) {
      state.user = user;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  actions: {
    login({ commit }, user) {
      commit('login', user);
    },
    logout({ commit }) {
      commit('logout');
    },
    checkLoginStatus({ commit }) {
      // Lógica para checar o status do login, como acessar o localStorage ou fazer um fetch no servidor
      const isLoggedIn = false; // Coloque sua lógica aqui
      if (isLoggedIn) {
        commit('login', { /* dados do usuário */ });
      } else {
        commit('logout');
      }
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    user: (state) => state.user,
  },
};
