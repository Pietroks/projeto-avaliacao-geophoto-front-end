import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Certifique-se de que esse caminho está correto

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

store.dispatch('user/checkLoginStatus');

const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
