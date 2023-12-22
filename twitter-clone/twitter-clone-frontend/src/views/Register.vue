<template>
  <div id="register">
    <div>Register</div>
    <input v-model="login" placeholder="Login" />
    <input v-model="password" placeholder="Password" type="password" />
    <button @click="apiRegister">Register</button>
  </div>
</template>

<script setup>
import axios from "../api/axios";

// Variables to store user input
let login = "";
let password = "";

// Function to handle registration
const apiRegister = async () => {
  try {
    await axios.post("/users/register", {
      login,
      password,
    });
    window.location.href = "/login";
  } catch (error) {
    console.error(error.response.data);
  }
};
</script>
<style scoped></style>
