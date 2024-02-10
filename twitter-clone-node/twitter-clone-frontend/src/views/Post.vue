<template>
  <div
    v-if="!post?.disabled && !post?.author.blocked.includes(auth.id)"
    class="posts"
  >
    <Post
      v-if="post !== null"
      :showInitial="true"
      :post="post"
      :commentSection="true"
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
  <div v-if="post?.disabled">There is no content available under this URL</div>
  <div v-else-if="post?.author.blocked.includes(auth.id)">
    The post content has been blocked for you by its author
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "../api/axios";
import { useRoute } from "vue-router";
import Post from "../components/Post.vue";
import { socket } from "../socket";
import useAuthStore from "../stores/AuthStore";

const auth = useAuthStore();
const route = useRoute();
const postId = route.params.postId;

const post = ref(null);
const incomingPosts = ref([]);

onMounted(async () => {
  await axios.get(`/posts/${postId}`).then((res) => {
    post.value = res.data;
  });
  socket.emit("postView", { postId: postId, user: auth.login });
  socket.off("newPost");
  socket.on("newPost", (newPost) => {
    if (
      newPost.initialPost?._id == post.value._id &&
      newPost.author.login !== auth.login
    ) {
      switch (newPost.type) {
        case "post":
          post.value.reposts.push({ ...newPost, initialPost: null });
          alert("New repost has been added in this post");
          break;
        case "comment":
          incomingPosts.value.push({
            ...newPost,
            initialPost: null,
          });
          break;
      }
    }
  });
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
  window.onscroll = function (ev) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      loadComments();
    }
  };
});

const showNewestPosts = () => {
  post.value.comments = incomingPosts.value
    .concat(post.value.comments)
    .slice(0, 5);
  incomingPosts.value = [];
};

const loadComments = async () => {
  if (post.value.comments.length > 0) {
    const commentsToLoad = await axios.get(
      `/posts/${postId}?commentsReceived=${post.value.comments.map(
        (com) => com._id
      )}`
    );
    post.value.comments = post.value.comments.concat(commentsToLoad.data);
  }
};
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
</style>
