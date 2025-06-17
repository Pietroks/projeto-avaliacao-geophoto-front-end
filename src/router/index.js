import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Cadastro from '../views/Cadastro.vue';
import Sobre from '../views/Sobre.vue';
import Upload from '../views/Upload.vue';
import Admin from '../views/Admin.vue';
import Premiacao from '@/views/Premiacao.vue';
import CadastroAvaliador from '@/views/CadastroAvaliador.vue';
import Concurso from '@/views/Concurso.vue';
import Dashboard from '@/views/Dashboard.vue'; 
import store from '../store'; 
import VotacaoPage from '@/views/votacao.vue'
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/cadastro', component: Cadastro },
  { path: '/sobre', component: Sobre },
  { path: '/premiacao', component: Premiacao },
  { path: '/cadastroAvaliador', component: CadastroAvaliador },
  { path: '/concurso', component: Concurso },
  {
    path: '/upload',
    component: Upload,
    meta: { requiresAuth: true }, 
  },
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true }, 
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }, 
  },
  {
    path: "/votacao/:id",
    name: "votacao",
    component: VotacaoPage,
    meta: { requiresAuth: true },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware de Autenticação Global
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const isAuthenticated = store.getters['user/isAuthenticated'];
  const user = store.getters['user/user'];

  if (requiresAuth && !isAuthenticated) {
    // Se a rota exige autenticação e o usuário não está logado, redireciona para o login
    next('/login');
  } else if (requiresAdmin && user?.user_type !== 'admin') {
    // Se a rota exige admin e o usuário não é admin, redireciona para o dashboard ou home
    next('/dashboard');
  } else {
    // Permite o acesso
    next();
  }
});

export default router;
