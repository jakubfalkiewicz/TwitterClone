<template>
  <div id="login">
    <div>Login</div>
    <input v-model="login" placeholder="Login" />
    <input v-model="password" placeholder="Password" type="password" />
    <button @click="apiLogin">Login</button>
  </div>
</template>

<script setup>
import axios from "../api/axios";
import useAuthStore from "../stores/AuthStore";

const auth = useAuthStore();
let login = "";
let password = "";

const apiLogin = async () => {
  try {
    const response = await axios.post("/users/login", {
      login,
      password,
    });
    auth.logIn(response.data.login);
    window.location.href = "/";
  } catch (error) {
    console.error(error.response.data);
  }
};
</script>
<style scoped></style>
