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
      console.log(this.login);
    },
    logOut() {
      this.login = null;
      console.log(this.login);
    },
    async authenticate() {
      try {
        const authResponse = await axios.get("/users/authenticate");
        this.logIn(authResponse.data.login);
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
