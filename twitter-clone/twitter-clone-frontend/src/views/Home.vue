<template>
  <div>Feed:</div>
  <div v-if="Array.isArray(posts)" class="posts-container">
    <Post v-for="post in posts" :key="post._id" :post="post"></Post>
  </div>
</template>

<script setup>
import axios from "../api/axios";
import { ref, onMounted } from "vue";
import Post from "../components/Post.vue";

const posts = ref(null);

onMounted(async () => {
  const test = await axios.get(`/posts/feed`);
  console.log(test.data);
  posts.value = test.data;
  console.log(posts.value);
});
</script>

<style lang="scss" scoped>
.posts-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 60%;
  align-items: center;
}
</style>
