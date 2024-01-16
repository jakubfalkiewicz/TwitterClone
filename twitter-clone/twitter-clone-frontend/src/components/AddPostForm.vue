<template>
  <div id="addPost">
    <div class="form-container">
      <div>
        <div>Add post</div>
        <button @click="closeModal">Cancel</button>
      </div>
      <input v-model="content" placeholder="Enter your post content" />
      <button @click="submitPost(postType, initialPost)">Submit Post</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "../api/axios";
const emits = defineEmits(["close", "submitPost"]);
defineProps(["userAvatar", "postType", "initialPost"]);
const content = ref("");

const closeModal = () => {
  emits("close");
};

const submitPost = async (postType, initialPost) => {
  const response = await axios.post("/posts/", {
    text: content.value,
    photo: null,
    type: postType,
    initialPost: initialPost,
  });
  emits("submitPost", { ...response.data });
  content.value = "";
  closeModal();
};
</script>

<style scoped></style>
