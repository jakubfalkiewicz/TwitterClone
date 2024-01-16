<template>
  <div id="post-form" @click="handleClose"></div>
  <div class="post-form-container">
    <div class="form">
      <i @click="handleClose" class="bi bi-x"></i>
      <textarea
        id="textarea"
        placeholder="Write your reply..."
        :value="httpRequest === 'PUT' ? initialPost.text : postText"
        @input="autoResize($event.target)"
      ></textarea>
      <div v-if="postType === 'post'" class="post-wrapper">
        <Post :post="initialPost" :show-metadata="false"></Post>
      </div>
      <button @click="handleSubmit" type="submit">
        {{ initialPost ? "Post" : "Reply" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Post from "./Post.vue";
import axios from "../api/axios";
const props = defineProps(["postType", "user", "initialPost", "httpRequest"]);
const emits = defineEmits(["closeForm"]);

const showForm = ref(true);
const postText = ref("");

const handleClose = () => {
  showForm.value = !showForm.value;
  emits("closeForm");
};

const handleSubmit = async () => {
  if (props.httpRequest === "POST") {
    await axios.post("/posts/", {
      text: postText.value,
      photo: null,
      type: props.postType,
      initialPost: props.initialPost,
    });
  } else if (props.httpRequest === "PUT") {
    await axios.put(`/posts/${initialPost._id}`, {
      text: props.initialPost.text,
    });
  }
  handleClose();
};

const autoResize = (textarea) => {
  postText.value = textarea.value;
  textarea.style.height = "";
  textarea.style.height =
    textarea.scrollHeight - textarea.style.lineHeight + 3 + "px";
};
</script>

<style lang="scss">
#post-form {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.315);
}
.post-form-container {
  position: fixed;
  top: 10%;
  width: 60%;
  max-width: 750px;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  background: black;
  padding: 1rem;

  .post-wrapper {
    border: 1px solid white;
  }
  .form {
    display: flex;
    flex-direction: column;
    width: 100%;
    i {
      font-size: 1.5rem;
      line-height: 0.5rem;
      align-self: flex-start;
    }
    i:hover {
      cursor: pointer;
    }
    button {
      align-self: flex-end;
      margin-top: 1rem;
    }
  }
}
textarea {
  height: 1.2rem;
  resize: none;
  border: none;
  background: transparent;
  outline: none;
  padding: 0;
  overflow: hidden;
  padding: 0.5rem 0 0.5rem 0.25rem;
  font-size: 1rem;
}
</style>
