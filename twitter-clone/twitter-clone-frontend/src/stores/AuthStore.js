import { defineStore } from "pinia";
import axios from "../api/axios";

const useAuthStore = defineStore("auth", {
  state: () => ({
    login: null,
    follows: null,
    authRequestSent: false,
  }),
  actions: {
    logIn(user) {
      this.login = user.login;
      this.follows = user.follows;
    },
    logOut() {
      this.login = null;
      this.follows = null;
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
      return this.login !== null;
    },
  },
});
export default useAuthStore;