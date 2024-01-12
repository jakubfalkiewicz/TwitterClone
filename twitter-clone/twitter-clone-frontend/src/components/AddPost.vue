<template>
  <div id="post-form" @click="handleClose"></div>
  <div class="post-form-container">
    <div class="form">
      <i class="bi bi-x"></i>
      <textarea
        placeholder="Write your reply..."
        @input="autoResize($event.target)"
      ></textarea>
      <button type="submit">Post/Reply</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
defineProps(["postType", "user", "initialPost"]);
const emits = defineEmits(["closeForm"]);

const showForm = ref(true);

function handleClose() {
  showForm.value = !showForm.value;
  emits("closeForm");
}

function autoResize(textarea) {
  console.log(textarea);
  textarea.style.height = "";
  textarea.style.height = textarea.scrollHeight + 3 + "px";
}
</script>

<style lang="scss">
#post-form {
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.315);
}
.post-form-container {
  position: absolute;
  min-width: 300px;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  background: black;
  padding: 1rem;

  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    i {
      font-size: 1.5rem;
      align-self: flex-start;
    }
    button {
      align-self: flex-end;
    }
  }
}
textarea {
  height: 1.2rem;
  width: 100%;
  resize: none;
  border: none;
  background: transparent;
  outline: none;
  padding: 0;
  padding-bottom: 1rem;
  font-size: 1rem;
}
</style>
