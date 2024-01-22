<template>
  <div v-if="!post?.disabled" class="posts">
    <Post
      v-if="post !== null"
      :showInitial="true"
      :post="post"
      :commentSection="true"
    ></Post>
  </div>
  <div v-else>There is no content available under this URL</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "../api/axios";
import { useRoute } from "vue-router";
import Post from "../components/Post.vue";

const post = ref(null);
const route = useRoute();

onMounted(async () => {
  const postId = route.params.postId;
  await axios.get(`/posts/${postId}`).then((res) => {
    post.value = res.data;
    console.log(post.value);
  });
});
</script>

<style lang="scss" scoped>
.posts {
  display: flex;
  width: 60%;
  justify-content: center;
  @media (max-width: 768px) {
    width: 100%;
  }
}
</style>
