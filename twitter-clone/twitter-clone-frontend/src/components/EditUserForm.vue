<template>
  <div id="edit-user">
    <div>Edit user</div>
    <input :value="login" placeholder="New login" />
    <input :value="password" placeholder="New password" type="password" />
    <div>
      Avatar:
      <input
        id="avatar-input"
        v-on:change="handleFileUpload($event)"
        type="file"
      />
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
const emits = defineEmits(["closeForm"]);

let login = "";
let password = "";
const file = ref(null);
const formData = new FormData();
const router = useRouter();
const auth = useAuthStore();

const handleFileUpload = (event) => {
  console.log(event.target.files);
  if (event.target.files[0].size > 1024 * 1024) {
    document.getElementById("avatar-input").value = null;
    alert("The file is too big. Please insert a file with maximum size of 1MB");
  } else {
    file.value = event.target.files[0];
    formData.append("file", file.value);
  }
};

const updateUserAvatar = async () => {
  if (login) {
    formData.append("login", login);
  }
  if (password) {
    formData.append("password", password);
  }
  console.log(login, password, file.value);
  try {
    await axios.put("/users/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (login.value || password.value) {
      await axios.post("/users/logout");
      auth.logOut();
      router.push("/login");
    } else {
      emits("closeForm");
    }
  } catch (error) {
    alert(error.response.data);
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
