import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Cadastro from "../views/Cadastro.vue";
import Sobre from "../views/Sobre.vue";
import Upload from "../views/Upload.vue";
import Admin from "../views/Admin.vue";
import Premiacao from "@/views/Premiacao.vue";
import Concurso from "@/views/Concurso.vue";
import Dashboard from "@/views/Dashboard.vue";
import store from "../store";
import VotacaoPage from "@/views/votacao.vue";
import UserUpdate from "@/views/UserUpdate.vue";
const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/cadastro", component: Cadastro },
  { path: "/sobre", component: Sobre },
  { path: "/premiacao", component: Premiacao },
  {
    path: "/concurso",
    component: Concurso,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/upload",
    component: Upload,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/votacao/:id",
    name: "votacao",
    component: VotacaoPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-profile/:id",
    name: "AtualizarUsuario",
    component: UserUpdate,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware de Autenticação Global
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const isAuthenticated = store.getters["user/isAuthenticated"];
  const isAvaliador = store.getters["user/isAvaliador"];

  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (requiresAdmin && !isAvaliador) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
