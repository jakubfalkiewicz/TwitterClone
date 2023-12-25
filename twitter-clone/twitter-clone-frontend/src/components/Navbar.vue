<template>
  <div id="navbar">
    <button @click="navigateToHome">Home</button>
    <button v-if="isAuthenticated" @click="navigateToAccount">Account</button>
    <button v-if="isAuthenticated" @click="logOut">Logout</button>
    <button v-if="!isAuthenticated" @click="navigateToRegister">
      Register
    </button>
    <button v-if="!isAuthenticated" @click="navigateToLogin">Login</button>
  </div>
</template>
<script setup>
import axios from "../api/axios";
import { useRouter } from "vue-router";
import useAuthStore from "../stores/AuthStore";

const auth = useAuthStore();
const router = useRouter();
defineProps(["isAuthenticated"]);

const navigateToRegister = () => {
  router.push({ path: "/register" });
};
const navigateToLogin = () => {
  router.push({ path: "/login" });
};
const navigateToHome = () => {
  router.push({ path: "/" });
};
const navigateToAccount = () => {
  router.push({ path: `/user/${auth.login}` });
};

const logOut = async () => {
  await axios.post("/users/logout");
  auth.logOut();
  router.push({ path: "/login" });
};
</script>
<style scoped>
#navbar {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
</style>
