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
    <div
      v-if="incomingPosts.length > 0"
      class="incoming-posts"
      @click="showNewestPosts"
    >
      <i class="bi bi-bell"></i>
      <div>{{ incomingPosts.length }}</div>
    </div>
  </div>
</template>

<script setup>
import axios from "../api/axios";
import { ref, onMounted } from "vue";
import Post from "../components/Post.vue";
import { useRoute, useRouter } from "vue-router";
import { socket } from "../socket";
import useAuthStore from "../stores/AuthStore";

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const posts = ref(null);
const pages = ref(1);
const incomingPosts = ref([]);

onMounted(async () => {
  const query = route.query.page
    ? `/posts/feed?pageNumber=${route.query.page}`
    : `/posts/feed`;
  const homeQuery = await axios.get(query);
  posts.value = homeQuery.data.posts;
  pages.value = homeQuery.data.pages;
  socket.off("newPost");
  socket.on("newPost", (newPost) => {
    if (auth.follows.includes(newPost.author._id) && newPost.type === "post") {
      incomingPosts.value.push({
        ...newPost,
        initialPost: null,
      });
    }
  });
});

const showNewestPosts = () => {
  if (!route.query?.page || 1 === route.query.page) {
    posts.value = incomingPosts.value.concat(posts.value).slice(0, 5);
    incomingPosts.value = [];
  } else {
    router.push(`/?page=${1}`);
  }
};
</script>

<style lang="scss" scoped>
.posts-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 60%;
  align-items: center;
  .incoming-posts {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 89, 255, 0.315);
    width: 50px;
    height: 50px;
    border-radius: 100%;
    transition: all 0.3s ease;
  }
  .incoming-posts:hover {
    background: rgb(0, 89, 255);
    cursor: pointer;
  }
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
