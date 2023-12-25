<script setup>
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import Navbar from "./components/Navbar.vue";
import useAuthStore from "./stores/AuthStore";
import { storeToRefs } from "pinia";

const auth = useAuthStore();
const { isAuthenticated, authRequestSent } = storeToRefs(auth);

onMounted(() => {
  auth.authenticate();
});
</script>

<template>
  <div v-if="authRequestSent">
    <Navbar :isAuthenticated="isAuthenticated"></Navbar>
    <RouterView></RouterView>
  </div>
</template>
