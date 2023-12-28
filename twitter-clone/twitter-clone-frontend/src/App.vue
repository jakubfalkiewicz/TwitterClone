<script setup>
import { RouterView, useRouter } from "vue-router";
import { onMounted, watchEffect } from "vue";
import Navbar from "./components/Navbar.vue";
import useAuthStore from "./stores/AuthStore";
import { storeToRefs } from "pinia";

const router = useRouter();
const auth = useAuthStore();
const { isAuthenticated, authRequestSent } = storeToRefs(auth);

onMounted(async () => {
  await auth.authenticate();
});

watchEffect(() => {
  setTimeout(() => {
    if (isAuthenticated.value != null && !isAuthenticated.value) {
      router.push({ path: "/login" });
    }
  }, 500);
  console.log(auth.login);
});
</script>

<template>
  <div v-if="authRequestSent">
    <Navbar :isAuthenticated="isAuthenticated"></Navbar>
    <RouterView :key="$route.fullPath"></RouterView>
  </div>
</template>
