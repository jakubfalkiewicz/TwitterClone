<template>
  <div id="navbar">
    <div class="navbar-row-1">
      <button v-if="auth.isAuthenticated" @click="navigateToHome">Home</button>
      <button v-if="auth.isAuthenticated" @click="navigateToAccount">Account</button>
      <button v-if="auth.isAuthenticated" @click="logOut">Logout</button>
      <button v-if="!auth.isAuthenticated" @click="navigateToRegister">
        Register
      </button>
      <button v-if="!auth.isAuthenticated" @click="navigateToLogin">Login</button>
    </div>
    <div class="navbar-row-2" v-if="auth.isAuthenticated">
      <div>
        <input
          placeholder="Find user"
          @input="findUser($event.target.value)"
          @click="watchFocus"
          name="userSearch"
        />
        <ul class="dropdown-list">
          <li class="dropdown-element" v-for="user in searchUsers">
            {{ user.login }}
          </li>
        </ul>
      </div>

      <i class="bi bi-arrow-return-left" @click="router.go(-1)"></i>
    </div>
  </div>
</template>
<script setup>
import axios from "../api/axios";
import { useRouter } from "vue-router";
import useAuthStore from "../stores/AuthStore";
import { ref } from "vue";

const auth = useAuthStore();
const router = useRouter();
const searchUsers = ref(null);

const findUser = async (input) => {
  if (input) {
    const users = await axios.get(`/users/search/${input}`);
    searchUsers.value = users.data;
  } else {
    searchUsers.value = null;
  }
};

let mousedownListener;

const watchFocus = () => {
  if (mousedownListener) {
    document.removeEventListener("mousedown", mousedownListener);
  }

  mousedownListener = (e) => {
    if (e.target.classList.contains("dropdown-element")) {
      router.push(`/user/${e.target.textContent}`);
      searchUsers.value = null;
    } else {
      searchUsers.value = null;
    }
  };

  document.addEventListener("mousedown", mousedownListener);
};

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
  gap: 1rem;
  width: 100%;
  .navbar-row-1 {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .navbar-row-2 {
    display: flex;
    gap: 1rem;
    width: 100%;
    justify-content: center;
    input {
      font-size: 1rem;
    }
    .dropdown-list {
      position: absolute;
      width: 200px;
      display: flex;
      flex-direction: column;
      background: transparent;
      gap: 0.5rem;
      margin-top: 0.5rem;
      .dropdown-element {
        text-decoration: none;
        list-style: none;
        cursor: pointer;
        padding: 0.25rem;
        background: gray;
      }
    }
  }
  .bi-arrow-return-left {
    font-size: 1.5rem;
  }
  .bi-arrow-return-left:hover {
    cursor: pointer;
  }
}
</style>
