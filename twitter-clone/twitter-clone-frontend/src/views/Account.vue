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
        <div class="edit-account">
          {{ user.login }}
          <i
            @click="showUserUpdate = !showUserUpdate"
            v-if="login === user.login"
            class="bi bi-gear"
          ></i>
        </div>
      </div>
      <div v-if="login !== user.login">
        <button v-if="!followed" @click="followUser">Follow</button>
        <button v-else @click="unfollowUser">Unollow</button>
      </div>
    </div>
    <EditUserForm
      v-if="user?.login && showUserUpdate"
      :propLogin="user.login"
    ></EditUserForm>
    <div class="post-type-select">
      <button
        :class="showPostType === 'post' ? 'active' : ''"
        @click="showPostType = 'post'"
      >
        Posts
      </button>
      <button
        :class="showPostType === 'comment' ? 'active' : ''"
        @click="showPostType = 'comment'"
      >
        Replies
      </button>
      <button
        v-if="user != null && user.login === login"
        @click="showForm = !showForm"
      >
        New post
      </button>
    </div>

    <Post
      v-for="post in posts"
      v-if="posts != null && showPostType === 'post'"
      :post="post"
    ></Post>
    <Post
      v-for="post in replies"
      v-if="replies != null && showPostType === 'comment'"
      :post="post"
    ></Post>
    <!-- </div> -->
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
import { storeToRefs } from "pinia";
import EditUserForm from "../components/EditUserForm.vue";

const auth = useAuthStore();
const { login, follows } = storeToRefs(auth);

const user = ref(null);
const posts = ref(null);
const replies = ref(null);
const route = useRoute();
const showForm = ref(false);
const followed = ref(null);
const showPostType = ref("post");
const showUserUpdate = ref(false);

onMounted(async () => {
  const username = route.params.username;
  await axios.get(`/users/${username}`).then((res) => {
    user.value = res.data;
    console.log(res.data);
  });
  await axios.get(`/posts/byUser/${user.value._id}`).then((res) => {
    posts.value = res.data.filter((el) => el.type === "post");
    replies.value = res.data.filter((el) => el.type === "comment");
  });
  followed.value = follows.value?.includes(user.value._id);
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
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  width: 60%;
  .post-type-select {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    button.active {
      border: 2px solid white;
    }
  }
  @media (max-width: 768px) {
    width: 90%;
  }
}
.edit-account {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  i:hover {
    cursor: pointer;
  }
}
.posts-container {
  display: flex;
}
.avatar {
  border-radius: 100%;
}
</style>
