<script setup>
import { RouterView, useRouter, useRoute } from "vue-router";
import { onMounted, watchEffect, computed, ref } from "vue";
import Navbar from "./components/Navbar.vue";
import useAuthStore from "./stores/AuthStore";
import { storeToRefs } from "pinia";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const { isAuthenticated, authRequestSent } = storeToRefs(auth);

onMounted(async () => {
  await auth.authenticate();
});

watchEffect(() => {
  if (
    isAuthenticated.value != null &&
    !isAuthenticated.value &&
    route.path !== "/register"
  ) {
    router.push({ path: "/login" });
  }
  setTimeout(() => {
    console.log(isAuthenticated.value);
    if (
      isAuthenticated.value != null &&
      !isAuthenticated.value &&
      route.path !== "/register"
    ) {
      router.push({ path: "/login" });
    }
    console.log(auth.login);
  }, 500);
});
</script>

<template>
  <div v-if="authRequestSent">
    <Navbar :isAuthenticated="isAuthenticated"></Navbar>
    <RouterView :key="$route.fullPath"></RouterView>
  </div>
</template>
