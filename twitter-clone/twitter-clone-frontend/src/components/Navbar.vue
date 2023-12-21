<template>
  <div id="navbar">
    <div>Navbar</div>
    <button @click="navigateToHome">Home</button>
    <button @click="navigateToRegister">Register</button>
    <button @click="navigateToLogin">Login</button>
  </div>
</template>
<script setup>
function navigateToRegister() {
  window.location.href = "/register";
}
function navigateToLogin() {
  window.location.href = "/login";
}
function navigateToHome() {
  window.location.href = "/";
}
</script>
<style scoped>
#navbar {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
</style>
