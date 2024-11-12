import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Cadastro from '../views/Cadastro.vue';
import Sobre from '../views/Sobre.vue';
import Upload from '../views/Upload.vue';
import Admin from '../views/Admin.vue';
import store from '../store'; // Certifique-se de que o caminho está correto
import Premiacao from '@/views/Premiacao.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/cadastro', component: Cadastro },
  { path: '/sobre', component: Sobre },
  { path: '/premiacao', component: Premiacao },
  {
    path: '/upload',
    component: Upload,
    meta: { requiresAuth: true }, // Requer autenticação
  },
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true }, // Requer autenticação
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
