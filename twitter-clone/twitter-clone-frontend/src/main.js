import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "./style.css";
import { createPinia } from "pinia";
import App from "./App.vue";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import NotFound from "./views/NotFound.vue";
import Account from "./views/Account.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/user/:username", component: Account },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(createPinia()).use(router).mount("#app");
