import { def } from "@vue/shared";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "", name: "home", component: () => import("@/views/Home.vue") },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/About.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
