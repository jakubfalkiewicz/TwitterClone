<template>
  <div id="register">
    <div>Register</div>
    <input v-model="login" placeholder="Login" />
    <input v-model="password" placeholder="Password" type="password" />
    <input v-on:change="handleFileUpload($event)" type="file" />
    <button @click="apiRegister">Register</button>
  </div>
</template>

<script setup>
import axios from "../api/axios";
import { ref } from "vue";
// Variables to store user input
let login = "";
let password = "";
const file = ref(null);
const formData = new FormData();

const handleFileUpload = (event) => {
  console.log(event.target.files);
  file.value = event.target.files[0];
  formData.append("file", file.value);
};
// Function to handle registration
const apiRegister = async () => {
  formData.append("login", login);
  formData.append("password", password);
  try {
    await axios.post("/users/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    window.location.href = "/login";
  } catch (error) {
    console.error(error.response.data);
  }
};
</script>
<style scoped></style>
