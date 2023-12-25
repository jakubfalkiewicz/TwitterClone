<template>
  <div id="account">
    <div v-if="user != null">{{ user.login }}</div>
    <div>
      <div>
        Posts
        <button @click="showForm = !showForm">+</button>
      </div>
      <!-- TODO: Separate component -->
      <div v-if="posts != null">
        <div v-for="post in posts">
          {{ post.text }}
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

const user = ref(null);
const posts = ref(null);
const route = useRoute();
const showForm = ref(false);

onMounted(async () => {
  const username = route.params.username;
  await axios.get(`/users/${username}`).then((res) => {
    user.value = res.data;
  });
  await axios.get(`/posts/${user.value._id}`).then((res) => {
    posts.value = res.data;
  });
});

const addPost = (post) => {
  posts.value.push(post);
};
</script>
<style scoped></style>
