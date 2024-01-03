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
}, auth);
</script>

<template>
  <div v-if="authRequestSent" class="app-layout">
    <Navbar :isAuthenticated="isAuthenticated"></Navbar>
    <RouterView :key="$route.fullPath"></RouterView>
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
