<script setup>
import { ref } from "vue";
const count = ref(0);
</script>

<template>
  <h1>About</h1>
  <button @click="count++">{{ count }}</button>
</template>
