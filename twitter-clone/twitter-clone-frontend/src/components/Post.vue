<template>
  <div v-if="post.disabled" class="disabled-post">
    <div class="disabled-layout">
      <Post
        v-if="post.initialPost && showInitial && post.type !== 'post'"
        :showInitial="true"
        :post="post.initialPost"
      ></Post>
      <div class="disabled-info">This Post has been deleted by its author</div>
    </div>
  </div>
  <div v-else class="post-component" :key="post._id">
    <Post
      v-if="post.initialPost && showInitial && post.type !== 'post'"
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
        <div
          class="post-wrapper"
          @click="router.push(`/post/${post.initialPost._id}`)"
          v-if="post.type === 'post' && post.initialPost !== null"
        >
          <Post :post="post.initialPost" :show-metadata="false"></Post>
        </div>
        <div v-if="showMetadata" class="post-metadata-container">
          <div
            class="post-metadata"
            @click="
              httpRequest = 'POST';
              repostType = 'comment';
              showRepostForm = !showRepostForm;
            "
          >
            <i class="bi bi-chat-left-text"></i>
            {{ post.comments?.length }}
          </div>
          <div
            class="post-metadata"
            @click="
              httpRequest = 'POST';
              repostType = 'post';
              showRepostForm = !showRepostForm;
            "
          >
            <i class="bi bi-repeat"></i> {{ post.reposts?.length }}
          </div>
          <div class="post-metadata">
            <i class="bi bi-bar-chart"></i> {{ post.views }}
          </div>
        </div>
        <div
          v-if="user?.login === post.author.login && showMetadata"
          class="post-modify"
        >
          <button
            @click="
              httpRequest = 'PUT';
              repostType = post.type;
              showRepostForm = !showRepostForm;
            "
          >
            EDIT
          </button>
          <button @click="handleDelete(post._id)">DELETE</button>
        </div>
      </div>
      <div class="reply-row" v-if="commentSection === true">
        <input name="replyText" v-model="replyText" placeholder="Reply" />
        <button type="submit" @click="submitReply">SUBMIT REPLY</button>
      </div>
      <div
        v-if="commentSection === true"
        v-for="comment in post.comments.filter((comment) => !comment.disabled)"
      >
        <Post :post="comment"></Post>
        <div class="separator"></div>
      </div>
    </div>
  </div>
  <AddPost
    v-if="showRepostForm"
    v-on:closeForm="showRepostForm = !showRepostForm"
    :initial-post="post"
    :post-type="repostType"
    :httpRequest="httpRequest"
  ></AddPost>
</template>
<script setup>
const props = defineProps({
  post: { type: Object, required: true },
  commentSection: { type: Boolean, default: false },
  showInitial: { type: Boolean, default: false },
  showMetadata: { type: Boolean, default: true },
});
import { useRouter, useRoute } from "vue-router";
import useAuthStore from "../stores/AuthStore";
import { ref, onMounted } from "vue";
import axios from "../api/axios";
import AddPost from "./AddPost.vue";

const router = useRouter();
const route = useRoute();
const { login } = useAuthStore();
const user = ref(null);
const replyText = ref("");
const showRepostForm = ref(false);
const repostType = ref("");
const httpRequest = ref(null);

onMounted(async () => {
  await axios.get(`/users/${login}`).then((res) => {
    user.value = res.data;
  });
});

const submitReply = async () => {
  const reply = await axios.post(`/posts/`, {
    text: replyText.value,
    photo: null,
    type: "comment",
    initialPost: route.params.postId,
  });
  props.post.comments.push(reply.data);
};

const handleDelete = async (id) => {
  if (window.confirm("Do you really want to delete this post?")) {
    const post = await axios.delete(`/posts/${id}`);
    if (route.params.postId === id) {
      router.push("/");
    }
    if (post.data.post) {
      props.post.disabled = true;
    }
  }
};

const hasClassInAncestors = (element, className) => {
  if (!element || !element.classList) {
    return false;
  }
  if (element.classList.contains(className)) {
    return true;
  }
  return hasClassInAncestors(element.parentElement, className);
};

const elementClick = (el, postId) => {
  if (
    hasClassInAncestors(el, "post-metadata") ||
    hasClassInAncestors(el, "post-wrapper") ||
    hasClassInAncestors(el, "post-modify")
  ) {
    return;
  }
  if (!hasClassInAncestors(el, "post-user")) {
    router.push(`/post/${postId}`);
  }
};
</script>

<style lang="scss" scoped>
.disabled-post {
  width: 100%;
  .disabled-layout {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .disabled-info {
      background: black;
      padding-block: 1rem;
    }
  }
}
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
    min-width: 300px;
    .reply-row {
      padding: 0.5rem;
    }
    .post {
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      background: black;
      padding: 1rem;
      text-align: start;
      gap: 0.5rem;
      .post-wrapper {
        border: 1px solid white;
      }
      .post-modify {
        display: flex;
        justify-content: space-evenly;
      }
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
        .post-user:hover {
          cursor: pointer;
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
        .post-metadata:hover {
          cursor: pointer;
        }
      }
    }
  }
  .separator {
    height: 0;
    border-bottom: 1px solid white;
    width: 100%;
  }
  @media (max-width: 768px) {
    .post-container {
      min-width: auto;
    }
  }
}
</style>
