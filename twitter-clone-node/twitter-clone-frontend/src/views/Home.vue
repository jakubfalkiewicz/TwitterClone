<template>
  <div>Feed:</div>
  <div v-if="Array.isArray(posts)" class="posts-container">
    <Post
      v-for="post in posts.filter((el) => !el.disabled)"
      :key="post._id"
      :post="post"
    ></Post>
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
import { socket } from "../socket";
import useAuthStore from "../stores/AuthStore";

const auth = useAuthStore();
const posts = ref(null);
const incomingPosts = ref([]);

onMounted(async () => {
  const homeQuery = await axios.get("/posts/feed");
  posts.value = homeQuery.data;
  socket.off("newPost");
  socket.on("newPost", (newPost) => {
    if (auth.follows.includes(newPost.author._id) && newPost.type === "post") {
      incomingPosts.value.push({
        ...newPost,
        initialPost: null,
      });
    }
  });
  window.onscroll = function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      loadPagePosts();
    }
  };
});

const loadPagePosts = async () => {
  const nextPagePosts = await axios.get(
    `/posts/feed?lastIndexId=${posts.value[posts.value.length - 1]._id}`
  );
  posts.value = posts.value.concat(nextPagePosts.data);
};

const showNewestPosts = async () => {
  const nextPagePosts = await axios.get(
    `/posts/feed?loadNewest=${incomingPosts.value.length}`
  );
  posts.value = nextPagePosts.data.concat(posts.value);
  incomingPosts.value = [];
  window.scrollTo(0, 0);
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
  align-items: center;
  i {
    font-size: 1.5rem;
    cursor: pointer;
  }
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
