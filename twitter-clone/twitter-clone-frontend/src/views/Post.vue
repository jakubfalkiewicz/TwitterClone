<template>
  <div class="posts">
    <Post
      v-if="post !== null"
      :showInitial="true"
      :post="post"
      :commentSection="true"
    ></Post>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "../api/axios";
import { useRoute } from "vue-router";
import useAuthStore from "../stores/AuthStore";
import Post from "../components/Post.vue";

const { follows, login } = useAuthStore();

const user = ref(null);
const post = ref(null);
const route = useRoute();
const followed = ref(null);

onMounted(async () => {
  const postId = route.params.postId;
  await axios.get(`/posts/${postId}`).then((res) => {
    post.value = res.data;
    console.log(post.value);
  });
  //   followed.value = follows?.includes(user.value._id);
});
</script>

<style lang="scss" scoped>
.posts {
  display: flex;
  width: 60%;
  justify-content: center;
  @media (max-width: 768px) {
    width: 90%;
  }
}
</style>
