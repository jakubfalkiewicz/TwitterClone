import { defineStore } from "pinia";

export const userStore = defineStore("main", {
  state: () => ({
    usersList: [],
    loggedUser: {},
  }),
  actions: {
    setStore(store) {
      this.usersList = store;
    },
    setLoggedUser(user) {
      this.loggedUser = user;
    },
  },
});
