export const state = () => ({
    user: null,
    token: null,
  });
  
  export const mutations = {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
    },
  };
  
  export const actions = {
    login({ commit }, { user, token }) {
      commit("setUser", user);
      commit("setToken", token);
      localStorage.setItem("authToken", token);
    },
    logout({ commit }) {
      commit("clearUser");
      localStorage.removeItem("authToken");
    },
    checkLoginStatus({ commit }) {
      const token = localStorage.getItem("authToken");
      if (token) {
        // Aqui você faria uma requisição para obter os dados do usuário com o token
        return fetch("/api/user-info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.user) {
              commit("setUser", data.user);
              commit("setToken", token);
            } else {
              commit("clearUser");
            }
          })
          .catch(() => {
            commit("clearUser");
          });
      } else {
        commit("clearUser");
      }
    },
  };
  