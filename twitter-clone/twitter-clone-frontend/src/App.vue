<script setup>
import { RouterView, useRouter, useRoute } from "vue-router";
import { onMounted, watch } from "vue";
import Navbar from "./components/Navbar.vue";
import useAuthStore from "./stores/AuthStore";
import { storeToRefs } from "pinia";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const { authRequestSent, isAuthenticated } = storeToRefs(auth);

onMounted(async () => {
  await auth.authenticate();
  console.log("AUTHENTICATE");
  if (authRequestSent.value && !isAuthenticated.value) {
    router.push("/login");
  }
});

watch(
  () => route.fullPath,
  async () => {
    if (
      !isAuthenticated.value &&
      route.fullPath !== "/register" &&
      authRequestSent.value
    ) {
      router.push("/login");
    }
  }
);
</script>

<template>
  <div class="app-layout">
    <Navbar :isAuthenticated="isAuthenticated"></Navbar>
    <RouterView :key="route.fullPath"></RouterView>
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
