<template>
  <div>Feed:</div>
  <div v-for="post in posts" v-if="posts != null" class="posts-container">
    <Post :post="post"></Post>
  </div>
</template>

<script setup>
import axios from "../api/axios";
import { ref, onMounted } from "vue";
import useAuthStore from "../stores/AuthStore";
import Post from "../components/Post.vue";

const { follows } = useAuthStore();
const posts = ref(null);

onMounted(async () => {
  console.log(follows);
  const test = await axios.get(`/posts/feed`);
  posts.value = test.data;
});
</script>

<style lang="scss" scoped>
.posts-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
