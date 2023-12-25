<template>
  <div id="account">
    <div v-if="user != null">
      <div>{{ user.login }}</div>
      <div v-if="login !== user.login">
        <button v-if="!followed" @click="followUser">Follow</button>
        <button v-else @click="unfollowUser">Unollow</button>
      </div>
    </div>
    <div>
      Posts
      <button @click="showForm = !showForm">+</button>
    </div>
    <!-- TODO: Separate component -->
    <div v-if="posts != null" class="posts-container">
      <div v-for="post in posts" class="post">
        <div class="post-headline">
          <div>{{ user.login }}</div>
          <div>{{ post.date }}</div>
        </div>
        <div>
          {{ post.text.slice(0, 100) + (post.text.length > 100 ? "..." : "") }}
        </div>
        <div class="post-metadata">
          <div>Comments: {{ post.comments.length }}</div>
          <div>Reposts: {{ post.reposts.length }}</div>
          <div>Views: {{ post.views }}</div>
        </div>
      </div>
    </div>
  </div>
  <AddPostForm
    v-if="showForm"
    v-on:close="showForm = !showForm"
    v-on:submitPost="addPost"
  ></AddPostForm>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "../api/axios";
import { useRoute } from "vue-router";
import AddPostForm from "../components/AddPostForm.vue";
import useAuthStore from "../stores/AuthStore";

const { follows, login } = useAuthStore();

const user = ref(null);
const posts = ref(null);
const route = useRoute();
const showForm = ref(false);
const followed = ref(null);

onMounted(async () => {
  const username = route.params.username;
  await axios.get(`/users/${username}`).then((res) => {
    user.value = res.data;
  });
  await axios.get(`/posts/${user.value._id}`).then((res) => {
    posts.value = res.data;
  });
  followed.value = follows.includes(user.value._id);
  console.log(followed.value);
});

const addPost = (post) => {
  posts.value.push(post);
};

const followUser = async (e) => {
  e.preventDefault();
  followed.value = !followed.value;
  console.log(followed.value);
  await axios.post("/users/follow", { followedId: user.value._id });
};

const unfollowUser = async (e) => {
  e.preventDefault();
  followed.value = !followed.value;
  console.log(followed.value);
  await axios.post("/users/unfollow", { unfollowedId: user.value._id });
};
</script>
<style lang="scss" scoped>
#account {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}
.posts-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  .post {
    display: flex;
    flex-direction: column;
    background: black;
    padding: 1rem;
    border-radius: 1rem;
    width: 40%;
    min-width: 250px;
    text-align: start;
    gap: 0.5rem;
    .post-headline {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .post-metadata {
      display: flex;
      justify-content: space-evenly;
    }
  }
}
</style>
