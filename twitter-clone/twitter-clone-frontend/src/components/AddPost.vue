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
      <div v-if="initialPost && postType === 'post'" class="post-wrapper">
        <Post :post="initialPost" :show-metadata="false"></Post>
      </div>
      <img id="output" />
      <div class="post-form-file">
        <div>
          <i @click="removeFile" v-if="file !== null" class="bi bi-trash3"></i>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            @change="loadFile($event)"
          />
        </div>
        <button @click="handleSubmit" type="submit">
          {{ initialPost ? "Post" : "Reply" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Post from "./Post.vue";
import axios from "../api/axios";
const props = defineProps(["postType", "user", "initialPost", "httpRequest"]);
const emits = defineEmits(["closeForm", "addPost"]);

const showForm = ref(true);
const postText = ref("");
const file = ref(null);
const formData = new FormData();

const handleClose = () => {
  showForm.value = !showForm.value;
  emits("closeForm");
};

const handleSubmit = async () => {
  if (props.httpRequest === "POST") {
    let newPost;
    formData.delete("text");
    formData.append("text", postText.value);
    if (!props.initialPost && file.value !== null) {
      formData.delete("type");
      formData.append("type", "post");
      newPost = await axios.post("/posts/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      newPost = await axios.post("/posts/", {
        text: postText.value,
        photo: null,
        type: props.postType,
        initialPost: props.initialPost,
      });
    }
    emits("addPost", newPost.data);
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

const loadFile = (event) => {
  if (event.target.files[0].size > 1024 * 1024) {
    document.getElementById("file-input").value = null;
    alert("The file is too big. Please insert a file with maximum size of 1MB");
    return;
  }
  file.value = event.target.files[0];
  formData.delete("file");
  formData.append("file", file.value);
  var output = document.getElementById("output");
  output.src = URL.createObjectURL(event.target.files[0]);
  output.onload = function () {
    URL.revokeObjectURL(output.src);
  };
};

const removeFile = () => {
  formData.delete("file");
  console.log(document.getElementById("output"));
  document.getElementById("file-input").value = null;
  document.getElementById("output").src = "";
  file.value = null;
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
  position: absolute;
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
  width: 100%;
  .post-wrapper {
    border: 1px solid white;
  }
  .form {
    display: flex;
    flex-direction: column;
    width: 100%;
    .post-form-file {
      margin-top: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      > div {
        display: flex;
        gap: 0.5rem;
      }
      #output {
        max-height: 50vh;
        width: auto;
        object-fit: contain;
      }
      i {
        font-size: 1.25rem;
      }
    }
    i {
      font-size: 1.5rem;
      line-height: 0.5rem;
      align-self: flex-start;
    }
    i:hover {
      cursor: pointer;
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
