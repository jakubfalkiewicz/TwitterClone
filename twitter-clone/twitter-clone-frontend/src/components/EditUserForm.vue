<template>
  <div id="edit-user">
    <div>Edit user</div>
    <input v-model="login" placeholder="Login" />
    <input v-model="password" placeholder="Password" type="password" />
    <div>
      Avatar: <input v-on:change="handleFileUpload($event)" type="file" />
    </div>

    <button @click="updateUserAvatar">Update account</button>
  </div>
</template>

<script setup>
import axios from "../api/axios";
import { ref } from "vue";
defineProps(["propLogin"]);

let login = null;
let password = null;
const file = ref(null);
const formData = new FormData();

const handleFileUpload = (event) => {
  console.log(event.target.files);
  file.value = event.target.files[0];
  formData.append("file", file.value);
};

const updateUserAvatar = async () => {
  formData.append("login", login);
  formData.append("password", password);
  try {
    await axios.put("/users/", formData, {
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
<style scoped>
#edit-user {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 500px;
  input {
    font-size: 1rem;
  }
}
</style>
