<template>
  <div class="post" @click="$router.push(`/post/${post._id}`)">
    <div class="post-headline">
      <div class="post-user" @click="$router.push(`/user/${post.authorName}`)">
        <img
          :width="30"
          :height="30"
          class="avatar"
          alt=""
          :src="post.authorAvatar"
        />
        <div>
          {{ post.authorName }}
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
</template>
<script setup>
defineProps(["post"]);
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<style lang="scss" scoped>
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
</style>
