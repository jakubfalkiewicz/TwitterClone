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
import { ref } from "vue";
const router = useRouter();

const auth = useAuthStore();
const login = ref("");
const password = ref("");

const apiLogin = async () => {
  if (!login.value || !password.value) {
    alert("Please enter login and password");
    return;
  }
  try {
    const response = await axios.post("/users/login", {
      login: login.value,
      password: password.value,
    });
    auth.logIn(response.data);
    router.push({ path: `/user/${response.data.login}` });
  } catch (error) {
    alert(error.response.data.message);
  }
};
</script>
<style scoped></style>
