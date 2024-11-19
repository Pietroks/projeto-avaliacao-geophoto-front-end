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
import Dashboard from '@/views/Dashboard.vue'; // Importando o Dashboard do Usuário
import store from '../store'; // Certifique-se de que o caminho está correto
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
    meta: { requiresAuth: true }, // Requer autenticação
  },
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true }, // Requer autenticação
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }, // Requer autenticação
  },
  {
    path: "/votacao/:id",
    name: "votacao",
    component: VotacaoPage,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware de Autenticação
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth; // Verifica se a rota requer autenticação
  const isAuthenticated = store.getters['user/isAuthenticated']; // Obtém o estado de autenticação do módulo 'user'

  // Verifica a necessidade de autenticação
  if (requiresAuth && !isAuthenticated) {
    // Redireciona para a página de login se não estiver autenticado
    next('/login');
  } else {
    next(); // Prossegue para a rota desejada
  }
});

export default router;
