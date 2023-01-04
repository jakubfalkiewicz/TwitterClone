<script setup>
import { onMounted } from "vue";
import { userStore } from "../store";

const store = userStore();

const getUsers = async () => {
  return fetch("http://localhost:4000/api/users/").then((response) =>
    response.json()
  );
};
onMounted(() => {
  getUsers().then((data) => {
    store.setStore(data);
  });
});
</script>

<template>
  <h1>Home</h1>
  <div>UsersList: {{ store.usersList }}</div>
  <div>Number: {{ store.number }}</div>
  <button @click="store.getUsersList">Get users</button>
  <button @click="store.increment()">Increment</button>
  <div v-for="post in store.usersList">
    <div>{{ post.username }}</div>
    <div>{{ post.email }}</div>
  </div>
</template>
