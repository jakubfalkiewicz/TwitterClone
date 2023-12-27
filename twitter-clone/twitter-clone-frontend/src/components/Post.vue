<template>
  <div class="post">
    <div class="post-headline">
      <!-- <div>{{ user.login }}</div> -->
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
</template>
<script setup>
defineProps(["post"]);
</script>

<style lang="scss" scoped>
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
</style>
