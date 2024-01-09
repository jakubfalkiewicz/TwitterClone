<template>
  <div id="account">
    <div v-if="user != null">
      <div>
        <img
          :width="50"
          :height="50"
          class="avatar"
          alt=""
          :src="user.avatarUrl"
        />
        <div>{{ user.login }}</div>
      </div>
      <div v-if="login !== user.login">
        <button v-if="!followed" @click="followUser">Follow</button>
        <button v-else @click="unfollowUser">Unollow</button>
      </div>
    </div>
    <div>
      Posts
      <button
        v-if="user != null && user.login === login"
        @click="showForm = !showForm"
      >
        +
      </button>
    </div>
    <div v-for="post in posts" v-if="posts != null" class="posts-container">
      <Post :post="post"></Post>
    </div>
  </div>
  <AddPostForm
    v-if="showForm"
    v-on:close="showForm = !showForm"
    v-on:submitPost="addPost"
    :userAvatar="user.avatarUrl"
    :postType="'post'"
    :initialPost="null"
  ></AddPostForm>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "../api/axios";
import { useRoute } from "vue-router";
import AddPostForm from "../components/AddPostForm.vue";
import Post from "../components/Post.vue";
import useAuthStore from "../stores/AuthStore";

const { follows, login } = useAuthStore();

const user = ref(null);
const posts = ref(null);
const route = useRoute();
const showForm = ref(false);
const followed = ref(null);

onMounted(async () => {
  const username = route.params.username;
  await axios.get(`/users/${username}`).then((res) => {
    user.value = res.data;
  });
  await axios.get(`/posts/byUser/${user.value._id}`).then((res) => {
    posts.value = res.data;
    console.log(posts.value);
  });
  followed.value = follows?.includes(user.value._id);
});

const addPost = (post) => {
  posts.value.push(post);
};

const followUser = async (e) => {
  e.preventDefault();
  followed.value = !followed.value;
  await axios.post("/users/follow", { followedId: user.value._id });
};

const unfollowUser = async (e) => {
  e.preventDefault();
  followed.value = !followed.value;
  await axios.post("/users/unfollow", { unfollowedId: user.value._id });
};
</script>
<style lang="scss" scoped>
#account {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}
.posts-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.avatar {
  border-radius: 100%;
}
</style>
