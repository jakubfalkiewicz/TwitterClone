<template>
  <div id="navbar">
    <div>Navbar</div>
    <button @click="navigateToHome">Home</button>
    <div v-if="isAuthenticated">
      <button @click="navigateToAccount">Account</button>
      <button @click="logOut">Logout</button>
    </div>
    <div v-else>
      <button @click="navigateToRegister">Register</button>
      <button @click="navigateToLogin">Login</button>
    </div>
  </div>
</template>
<script setup>
import axios from "../api/axios";
defineProps(["isAuthenticated"]);
const emit = defineEmits(["logout"]);

const navigateToRegister = () => (window.location.href = "/register");
const navigateToLogin = () => (window.location.href = "/login");
const navigateToHome = () => (window.location.href = "/");
const navigateToAccount = () => (window.location.href = "/");

const logOut = async () => {
  await axios.post("/users/logout");
  emit("logout");
  window.location.href = "/login";
};
</script>
<style scoped>
#navbar {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
</style>
