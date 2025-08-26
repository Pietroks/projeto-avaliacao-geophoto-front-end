import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

const routes = [
  { path: "/", component: () => import("@/views/Home.vue") },
  { path: "/login", component: () => import("@/views/Login.vue") },
  { path: "/cadastro", component: () => import("@/views/Cadastro.vue") },
  { path: "/sobre", component: () => import("@/views/Sobre.vue") },
  { path: "/premiacao", component: () => import("@/views/Premiacao.vue") },
  {
    path: "/concurso",
    component: () => import("@/views/Concurso.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin",
    component: () => import("@/views/Admin.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/Dashboard.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/votacao/:id",
    name: "votacao",
    component: () => import("@/views/votacao.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-profile/:id",
    name: "AtualizarUsuario",
    component: () => import("@/views/UserUpdate.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

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
