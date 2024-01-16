<template>
  <div id="register">
    <div>Register</div>
    <input v-model="login" placeholder="Login" />
    <input v-model="password" placeholder="Password" type="password" />
    <input
      id="avatar-input"
      v-on:change="handleFileUpload($event)"
      type="file"
    />
    <button @click="apiRegister">Register</button>
  </div>
</template>

<script setup>
import axios from "../api/axios";
import { ref } from "vue";

let login = "";
let password = "";
const file = ref(null);
const formData = new FormData();

const handleFileUpload = (event) => {
  if (event.target.files[0].size > 1024 * 1024) {
    document.getElementById("avatar-input").value = null;
    alert("The file is too big. Please insert a file with maximum size of 1MB");
  } else {
    file.value = event.target.files[0];
    formData.append("file", file.value);
  }
};

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
    console.error(error.message);
  }
};
</script>
<style scoped></style>
