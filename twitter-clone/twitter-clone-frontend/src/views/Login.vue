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
import { useRouter } from "vue-router";
const router = useRouter();

const auth = useAuthStore();
let login = "";
let password = "";

const apiLogin = async () => {
  try {
    const response = await axios.post("/users/login", {
      login,
      password,
    });
    auth.logIn(response.data);
    router.push({ path: `/user/${response.data.login}` });
  } catch (error) {
    console.error(error.response.data);
  }
};
</script>
<style scoped></style>
