<template>
  <div class="post-component">
    <Post
      v-if="post.initialPost && showInitial"
      :showInitial="true"
      :post="post.initialPost"
    ></Post>
    <div class="post-container">
      <div class="post" @click="elementClick($event.target, post._id)">
        <div class="post-headline">
          <div
            class="post-user"
            @click="$router.push(`/user/${post.author.login}`)"
          >
            <img
              :width="30"
              :height="30"
              class="avatar"
              alt=""
              :src="post.author.avatarUrl"
            />
            <div>
              {{ post.author.login }}
            </div>
          </div>
          <div>{{ post.date }}</div>
        </div>
        <div>
          {{ post.text }}
        </div>
        <div class="post-metadata-container">
          <div class="post-metadata">
            <i class="bi bi-chat-left-text"></i>
            {{ post.comments?.length }}
          </div>
          <div class="post-metadata" @click="showRepostForm = !showRepostForm">
            <i class="bi bi-repeat"></i> {{ post.reposts?.length }}
          </div>
          <div class="post-metadata">
            <i class="bi bi-bar-chart"></i> {{ post.views }}
          </div>
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
  </div>
  <AddPost
    v-if="showRepostForm"
    v-on:closeForm="showRepostForm = !showRepostForm"
  ></AddPost>
</template>
<script setup>
defineProps({
  post: { type: Object, required: true },
  commentSection: { type: Boolean, default: false },
  showInitial: { type: Boolean, default: false },
});
import { useRouter, useRoute } from "vue-router";
import useAuthStore from "../stores/AuthStore";
import { ref, onMounted } from "vue";
import axios from "../api/axios";
import AddPost from "./AddPost.vue";

const router = useRouter();
const route = useRoute();
const { follows, login } = useAuthStore();
const user = ref(null);
const replyText = ref("");
const showRepostForm = ref(false);

const aaa = () => {
  showRepostForm.value = !showRepostForm.value;
  console.log("dupa");
};

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

function hasClassInAncestors(element, className) {
  if (!element || !element.classList) {
    return false;
  }
  if (element.classList.contains(className)) {
    return true;
  }
  return hasClassInAncestors(element.parentElement, className);
}

const elementClick = (el, postId) => {
  if (hasClassInAncestors(el, "post-metadata")) {
    return;
  }
  if (!hasClassInAncestors(el, "post-user")) {
    router.push(`/post/${postId}`);
  }
};
</script>

<style lang="scss" scoped>
.post-component {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  .post-container {
    display: flex;
    flex-direction: column;
    background-color: rebeccapurple;
    width: 100%;
    max-width: 800px;
    min-width: 250px;
    .post {
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      background: black;
      padding: 1rem;
      text-align: start;
      gap: 0.5rem;
      .post-headline {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        .post-user {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          .avatar {
            border-radius: 100%;
          }
        }
      }
      .post-metadata-container {
        display: flex;
        justify-content: space-evenly;
        .post-metadata {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      }
    }
  }
}
</style>
