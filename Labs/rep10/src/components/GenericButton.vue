<template>
  <button :disabled="!isActive" @click="$emit('buttonAction')">
    {{ buttonText }}
  </button>
</template>
<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

defineProps<{ buttonText: string; isActive: boolean }>();
defineEmits<{ buttonAction: [] }>();
</script>
