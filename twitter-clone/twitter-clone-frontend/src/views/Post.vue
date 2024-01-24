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
import { socket } from "../socket";
import useAuthStore from "../stores/AuthStore";

const auth = useAuthStore();

const post = ref(null);
const route = useRoute();

onMounted(async () => {
  const postId = route.params.postId;
  await axios.get(`/posts/${postId}`).then((res) => {
    post.value = res.data;
  });
  socket.emit("postView", { postId: postId, user: auth.login });
  socket.off("newPost");
  socket.on("newPost", (newPost) => {
    console.log(newPost);
    if (
      newPost.initialPost._id == post.value._id &&
      newPost.author.login !== auth.login
    ) {
      switch (newPost.type) {
        case "post":
          post.value.reposts.push({ ...newPost, initialPost: null });
          alert("New repost has been added in this post");
          break;
        case "comment":
          post.value.comments.push(newPost);
          alert("New comment has been added in this post");
          break;
      }
    }
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
