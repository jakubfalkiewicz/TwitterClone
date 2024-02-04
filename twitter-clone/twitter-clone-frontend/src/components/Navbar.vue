<template>
  <div id="navbar">
    <div class="navbar-row-1">
      <button v-if="auth.isAuthenticated" @click="navigateToHome">Home</button>
      <div v-if="auth.isAuthenticated" class="account-container">
        <button v-if="auth.isAuthenticated" @click="navigateToAccount">
          Account
        </button>
        <div
          class="notifications-box"
          @click="showNotifications = !showNotifications"
        >
          <i class="bi bi-envelope"></i>
          <div>{{ auth?.notifications?.length }}</div>
        </div>
        <div class="notifications-modal" v-if="showNotifications">
          <div class="notifications-header">
            <div>NOTIFICATIONS</div>
            <i
              @click="showNotifications = !showNotifications"
              class="bi bi-x-lg"
            ></i>
          </div>
          <div class="notification" v-for="notification in auth.notifications">
            {{ notification.user?.login }} {{ notification.text }}
            <i class="bi bi-trash"></i>
          </div>
          <button @click="deleteAllNotifications">DELETE ALL</button>
        </div>
      </div>
      <button v-if="auth.isAuthenticated" @click="logOut">Logout</button>
      <button v-if="!auth.isAuthenticated" @click="navigateToRegister">
        Register
      </button>
      <button v-if="!auth.isAuthenticated" @click="navigateToLogin">
        Login
      </button>
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
const showNotifications = ref(false);

const findUser = async (input) => {
  if (input) {
    const users = await axios.get(`/users/search/${input}`);
    searchUsers.value = users.data;
  } else {
    searchUsers.value = null;
  }
};

const deleteAllNotifications = async () => {
  await axios.delete("/users/notification?deleteAll=true");
  auth.removeAllNotifications();
  showNotifications.value = !showNotifications.value;
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
    flex-wrap: wrap;
    gap: 0.5rem;
    .account-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      .notifications-box {
        display: flex;
        gap: 0.5rem;
        border: 1px solid white;
        padding: 0.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
      }
      .notifications-box:hover {
        box-shadow: rgba(255, 255, 255, 0.35) 0px 5px 15px;
      }
      .notifications-modal {
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 1rem;
        background: black;
        width: 100%;
        min-width: 300px;
        max-width: 500px;
        .notifications-header {
          display: flex;
          justify-content: space-between;
          i {
            cursor: pointer;
          }
        }
        .notification {
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          i {
            color: rgb(190, 32, 32);
          }
        }
      }
    }
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
