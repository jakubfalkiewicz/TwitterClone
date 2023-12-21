<template>
  <div id="register">
    <div>Register</div>
    <input v-model="login" placeholder="Login" />
    <input v-model="password" placeholder="Password" type="password" />
    <button @click="register">Register</button>
  </div>
</template>

<script setup>
import axios from "../api/axios";

// Variables to store user input
let login = "";
let password = "";

// Function to handle registration
const register = async () => {
  try {
    const response = await axios.post("/users/register", {
      login,
      password,
    });

    console.log("Registration successful", response.data);
  } catch (error) {
    console.error("Registration failed", error.response.data);
  }
};
</script>
<style scoped></style>
