<template>
  <div>Feed:</div>
  <div v-if="Array.isArray(posts)" class="posts-container">
    <Post
      v-for="post in posts.filter((el) => !el.disabled)"
      :key="post._id"
      :post="post"
    ></Post>
    <div class="page-select-container">
      <i
        class="bi bi-arrow-left-short"
        v-if="currPage !== 1"
        @click="loadPagePosts(currPage - 1)"
      ></i>
      <div
        class="page-select"
        :class="{
          active: 1 === currPage,
        }"
        @click="loadPagePosts(1)"
      >
        1
      </div>
      <div
        v-if="currPage !== 1 && currPage !== pages"
        class="page-select"
        :class="{
          active: pages !== currPage && currPage !== 1,
        }"
      >
        {{ currPage }}
      </div>
      <div
        v-if="pages > 1"
        :class="{
          active: pages === currPage,
        }"
        class="page-select"
        @click="loadPagePosts(pages)"
      >
        {{ pages }}
      </div>
      <i
        class="bi bi-arrow-right-short"
        v-if="pages > 1 && currPage !== pages"
        @click="loadPagePosts(currPage + 1)"
      ></i>
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
import { socket } from "../socket";
import useAuthStore from "../stores/AuthStore";

const auth = useAuthStore();
const posts = ref(null);
const pages = ref(1);
const incomingPosts = ref([]);
const currPage = ref(1);

onMounted(async () => {
  const query =
    currPage.value > 1
      ? `/posts/feed?pageNumber=${currPage.value}`
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

// const loadPagePosts = async (newPage) => {
//   currPage.value = newPage;
//   const nextPagePosts = await axios.get(
//     `/posts/feed?pageNumber=${currPage.value}&skipNew=${incomingPosts.value.length}`
//   );
//   posts.value = nextPagePosts.data.posts;
//   pages.value = nextPagePosts.data.pages;
// };

const loadPagePosts = async (newPage) => {
  if (newPage > currPage.value) {
    const nextPagePosts = await axios.get(
      `/posts/feed?lastIndexId=${posts.value[posts.value.length - 1]._id}`
    );
    posts.value = nextPagePosts.data.posts;
    pages.value = nextPagePosts.data.pages;
    currPage.value = newPage;
  } else if (newPage < currPage.value) {
    const prevPagePosts = await axios.get(
      `/posts/feed?firstIndexId=${posts.value[0]._id}`
    );
    posts.value = prevPagePosts.data.posts;
    pages.value = prevPagePosts.data.pages;
    currPage.value = newPage;
  }
  // currPage.value = newPage;
  // const nextPagePosts = await axios.get(
  //   `/posts/feed?pageNumber=${currPage.value}`
  // );
  // posts.value = nextPagePosts.data.posts;
  // pages.value = nextPagePosts.data.pages;
};

const showNewestPosts = async () => {
  currPage.value = currPage.value - 1;
  const nextPagePosts = await axios.get(`/posts/feed`);
  posts.value = nextPagePosts.data.posts;
  pages.value = nextPagePosts.data.pages;
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
