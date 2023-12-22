import { defineStore } from "pinia";
import axios from "../api/axios";

const useAuthStore = defineStore("auth", {
  state: () => ({
    login: null,
    authRequestSent: false,
  }),
  actions: {
    logIn(login) {
      this.login = login;
    },
    logOut() {
      this.login = null;
    },
    async authenticate() {
      try {
        const authResponse = await axios.get("/users/authenticate");
        this.logIn(authResponse.data.login);
      } catch (err) {
        console.log(err);
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
