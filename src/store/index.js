import { createStore } from 'vuex';
import user from './user'; // Caminho atualizado para o módulo 'user'

export default createStore({
  modules: {
    user,
  },
});
