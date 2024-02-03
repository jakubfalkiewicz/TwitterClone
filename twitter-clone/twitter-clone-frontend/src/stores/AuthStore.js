import { defineStore } from "pinia";
import axios from "../api/axios";

const useAuthStore = defineStore(
  "auth",
  {
    state: () => ({
      login: null,
      follows: null,
      blocked: null,
      id: null,
      notifications: [],
      authRequestSent: false,
    }),
    actions: {
      logIn(user) {
        this.login = user.login;
        this.follows = user.follows;
        this.blocked = user.blocked;
        this.id = user._id;
        this.notifications = user.notifications;
      },
      logOut() {
        this.login = null;
        this.follows = null;
        this.blocked = null;
        this.id = null;
        this.notifications = [];
      },
      followUser(user) {
        this.follows.push(user);
      },
      unfollowUser(user) {
        this.follows = this.follows.filter((follow) => follow !== user);
      },
      blockUser(user) {
        this.blocked.push(user);
      },
      unblockUser(user) {
        this.blocked = this.blocked.filter((block) => block !== user);
      },
      removeNotification(notificationId) {
        this.notifications = this.notifications.filter(
          (notification) => notification.id !== notificationId
        );
      },
      removeAllNotifications() {
        this.notifications = [];
      },

      async authenticate() {
        try {
          const authResponse = await axios.get("/users/authenticate");
          this.logIn(authResponse.data);
        } catch (err) {
          if (err.response.status !== 401) console.log(err);
        } finally {
          this.authRequestSent = true;
        }
      },
    },
    getters: {
      isAuthenticated() {
        return !this.login ? false : true;
      },
    },
  },
  { persist: true }
);
export default useAuthStore;
