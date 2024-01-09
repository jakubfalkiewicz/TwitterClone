<template>
  <div class="post-container">
    <div class="post" @click="elementClick($event.target, post._id)">
      <div class="post-headline">
        <div
          class="post-user"
          @click="$router.push(`/user/${post.authorName}`)"
        >
          <img
            :width="30"
            :height="30"
            class="avatar"
            alt=""
            :src="post.author.avatarUrl || post.authorAvatar"
          />
          <div>
            {{ post.author.login || post.authorName }}
          </div>
        </div>
        <div>{{ post.date }}</div>
      </div>
      <div>
        <!-- {{ post.text.slice(0, 100) + (post.text.length > 100 ? "..." : "") }} -->
        {{ post.text }}
      </div>
      <div class="post-metadata">
        <div>Comments: {{ post.comments?.length }}</div>
        <div>Reposts: {{ post.reposts?.length }}</div>
        <div>Views: {{ post.views }}</div>
      </div>
    </div>
    <div v-if="commentSection === true">
      <input v-model="replyText" placeholder="Reply" />
      <button type="submit" @click="submitReply">SUBMIT REPLY</button>
    </div>
    <div v-if="commentSection === true" v-for="comment in post.comments">
      <Post :post="comment"></Post>
    </div>
  </div>
</template>
<script setup>
defineProps({
  post: { type: Object, required: true },
  commentSection: { type: Boolean, default: false },
});
import { useRouter, useRoute } from "vue-router";
import useAuthStore from "../stores/AuthStore";
import { ref, onMounted } from "vue";
import axios from "../api/axios";

const router = useRouter();
const route = useRoute();
const { follows, login } = useAuthStore();
const user = ref(null);
const replyText = ref("");

onMounted(async () => {
  await axios.get(`/users/${login}`).then((res) => {
    user.value = res.data;
  });
});

const submitReply = async () => {
  await axios.post(`/posts/`, {
    text: replyText.value,
    photo: null,
    type: "comment",
    initialPost: route.params.postId,
  });
};

const elementClick = (el, postId) => {
  if (
    !el.classList.contains("post-user") &&
    !el.parentNode.classList.contains("post-user")
  ) {
    router.push(`/post/${postId}`);
  }
};
</script>

<style lang="scss" scoped>
.post-container {
  display: flex;
  flex-direction: column;
  background-color: rebeccapurple;
  width: 100%;
  align-items: center;
  padding: 1rem;
  .post {
    display: flex;
    flex-direction: column;
    background: black;
    padding: 1rem;
    border-radius: 1rem;
    min-width: 250px;
    max-width: 600px;
    text-align: start;
    gap: 0.5rem;
    width: 100%;
    .post-headline {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      .post-user {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 2;
        .avatar {
          border-radius: 100%;
        }
      }
    }
    .post-metadata {
      display: flex;
      justify-content: space-evenly;
    }
  }
}
</style>
