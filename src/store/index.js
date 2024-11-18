import { createStore } from 'vuex';
import user from './user'; // Caminho atualizado para o módulo 'user'

const store = createStore({
  modules: {
    user,
  },
});

store.dispatch('user/checkLoginStatus'); // Chama a ação de verificação de login assim que a store for criada

export default store;
