<template>
  <div id="addPost">
    <div class="form-container">
      <div>
        <div>Add post</div>
        <button @click="closeModal">Cancel</button>
      </div>
      <input v-model="content" placeholder="Enter your post content" />
      <button @click="submitPost">Submit Post</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "../api/axios";
const emits = defineEmits(["close", "submitPost"]);
const content = ref("");

const closeModal = () => {
  emits("close");
};

const submitPost = async () => {
  const response = await axios.post("/posts/", {
    text: content.value,
    photo: null,
  });
  console.log(response.data);
  emits("submitPost", { ...response.data });
  content.value = "";
  closeModal();
};
</script>

<style scoped></style>
