<template>
  <div>Feed:</div>
  <div v-if="Array.isArray(posts)" class="posts-container">
    <Post
      v-for="post in posts.filter((el) => !el.disabled)"
      :key="post._id"
      :post="post"
    ></Post>
    <div v-if="pages > 1" class="page-select-container">
      <div
        v-for="index in pages"
        class="page-select"
        :class="{
          active:
            index == $route.query.page || (!$route.query.page && index === 1),
        }"
        @click="router.push(`/?page=${index}`)"
      >
        {{ index }}
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "../api/axios";
import { ref, onMounted } from "vue";
import Post from "../components/Post.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const posts = ref(null);
const pages = ref(1);

onMounted(async () => {
  const query = route.query.page
    ? `/posts/feed?pageNumber=${route.query.page}`
    : `/posts/feed`;
  const test = await axios.get(query);
  posts.value = test.data.posts;
  pages.value = test.data.pages;
});
</script>

<style lang="scss" scoped>
.posts-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 60%;
  align-items: center;
  @media (max-width: 768px) {
    width: 100%;
  }
}
.page-select-container {
  display: flex;
  .page-select {
    padding: 0.5rem;
    border-radius: 100%;
    font-size: 1.5rem;
    text-align: center;
    text-decoration: underline;
    cursor: pointer;
  }
  .page-select.active {
    color: violet;
  }
}
</style>
