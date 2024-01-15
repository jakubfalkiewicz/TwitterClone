<template>
  <div id="navbar">
    <div class="navbar-row-1">
      <button v-if="isAuthenticated" @click="navigateToHome">Home</button>
      <button v-if="isAuthenticated" @click="navigateToAccount">Account</button>
      <button v-if="isAuthenticated" @click="logOut">Logout</button>
      <button v-if="!isAuthenticated" @click="navigateToRegister">
        Register
      </button>
      <button v-if="!isAuthenticated" @click="navigateToLogin">Login</button>
    </div>
    <div class="navbar-row-2">
      <i
        v-if="isAuthenticated"
        class="bi bi-arrow-return-left"
        @click="router.go(-1)"
      ></i>
    </div>
  </div>
</template>
<script setup>
import axios from "../api/axios";
import { useRouter } from "vue-router";
import useAuthStore from "../stores/AuthStore";

const auth = useAuthStore();
const router = useRouter();
defineProps(["isAuthenticated"]);

const navigateToRegister = () => {
  router.push({ path: "/register" });
};
const navigateToLogin = () => {
  router.push({ path: "/login" });
};
const navigateToHome = () => {
  router.push({ path: "/" });
};
const navigateToAccount = () => {
  router.push({ path: `/user/${auth.login}` });
};

const logOut = async () => {
  if (window.confirm("Are you sure you want to log out?")) {
    await axios.post("/users/logout");
    auth.logOut();
    router.push({ path: "/login" });
  }
};
</script>
<style lang="scss" scoped>
#navbar {
  display: flex;
  flex-direction: column;
  width: 100%;
  .navbar-row-1 {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .navbar-row-2 {
    display: flex;
    width: 100%;
    justify-content: center;
  }
  .bi-arrow-return-left {
    font-size: 1.5rem;
  }
  .bi-arrow-return-left:hover {
    cursor: pointer;
  }
}
</style>
