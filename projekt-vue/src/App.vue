<template>
  <nav>
    <router-link class="link" to="/">Home</router-link> |
    <router-link class="link" to="/about">About</router-link> |
    <router-link class="link" to="/register">Register</router-link> |
    <router-link class="link" to="/login">Login</router-link>
  </nav>
  <router-view />
</template>

<script setup>
import { RouterView, RouterLink } from "vue-router";
</script>
