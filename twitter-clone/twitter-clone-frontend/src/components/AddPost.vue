<template>
  <div id="post-form" @click="handleClose"></div>
  <div class="post-form-container">
    <div class="form">
      <i @click="handleClose" class="bi bi-x"></i>
      <textarea
        id="textarea"
        placeholder="Write your thoughts..."
        :value="postText"
        @input="autoResize($event.target)"
      ></textarea>
      <img
        id="output"
        :src="props.httpRequest === 'PUT' ? initialPost?.imageUrl : ''"
      />
      <div
        v-if="initialPost && postType === 'post' && props.httpRequest !== 'PUT'"
        class="post-wrapper"
      >
        <Post :post="initialPost" :show-metadata="false"></Post>
      </div>
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
          {{ !initialPost ? "Post" : "Reply" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Post from "./Post.vue";
import axios from "../api/axios";
const props = defineProps(["postType", "user", "initialPost", "httpRequest"]);
const emits = defineEmits(["closeForm", "addPost", "editPost"]);

const showForm = ref(true);
const postText = ref("");
const file = ref(null);
const formData = new FormData();

onMounted(() => {
  const textarea = document.querySelector("textarea");
  autoResize(textarea);
  if (props.httpRequest === "PUT") {
    postText.value = props.initialPost.text;
  }
});

const handleClose = () => {
  showForm.value = !showForm.value;
  emits("closeForm");
};

const handleSubmit = async () => {
  if (!postText.value) {
    alert("Please enter any text to submit the post");
    return;
  }
  formData.delete("text");
  formData.delete("type");
  formData.delete("initialPost");
  formData.append("text", postText.value);
  formData.append("type", props.postType);
  let newPost;
  if (props.httpRequest === "POST") {
    if (props.initialPost) {
      formData.append("initialPost", props.initialPost._id);
    }
    newPost =
      file.value !== null
        ? await axios.post("/posts/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : await axios.post("/posts/", {
            text: postText.value,
            photo: null,
            type: props.postType,
            initialPost: props.initialPost,
          });

    emits("addPost", newPost.data);
  } else if (props.httpRequest === "PUT") {
    newPost = await axios.put(`/posts/${props.initialPost._id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    emits("editPost", newPost.data);
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
  width: 100%;
  flex-wrap: wrap;
  overflow-y: auto;
  max-height: 75vh;
  .post-wrapper {
    border: 1px solid white;
  }
  .form {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
    #output {
      max-height: 50vh;
      width: auto;
      object-fit: contain;
    }
    .post-form-file {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      > div {
        display: flex;
        gap: 0.5rem;
        #file-input {
          max-width: 160px;
        }
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
  resize: none;
  border: none;
  background: transparent;
  outline: none;
  padding: 0;
  overflow: hidden;
  padding: 0.5rem 0 0.5rem 0.25rem;
  font-size: 1rem;
  color: white;
}
</style>
