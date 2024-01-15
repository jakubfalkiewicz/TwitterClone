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
import { useRouter } from "vue-router";
import useAuthStore from "../stores/AuthStore";
defineProps(["propLogin"]);

let login = "";
let password = "";
const file = ref(null);
const formData = new FormData();
const router = useRouter();
const auth = useAuthStore();

const handleFileUpload = (event) => {
  console.log(event.target.files);
  file.value = event.target.files[0];
  formData.append("file", file.value);
};

const updateUserAvatar = async () => {
  if (login) {
    formData.append("login", login);
  }
  if (password) {
    formData.append("password", password);
  }
  try {
    await axios.put("/users/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (login) {
      await axios.post("/users/logout");
      auth.logOut();
      router.push("/login");
    }
  } catch (error) {
    console.log(error.response);
    alert(error.response);
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
