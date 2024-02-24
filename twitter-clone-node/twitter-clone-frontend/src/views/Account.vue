<template>
  <div id="account" v-if="user != null && !user.blocked.includes(userId)">
    <div>
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
      <div class="user-account-actions" v-if="login !== user.login">
        <button v-if="!isBlocked" @click="blockUser">Block</button>
        <button v-else @click="unblockUser">Unblock</button>
        <button v-if="!isFollowed" @click="followUser">Follow</button>
        <button v-else @click="unfollowUser">Unollow</button>
      </div>
    </div>
    <EditUserForm
      v-if="user?.login && showUserUpdate"
      :propLogin="user.login"
      v-on:close-form="showUserUpdate = !showUserUpdate"
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
        @click="showNewPostForm = !showNewPostForm"
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
  </div>
  <div v-if="user && user.blocked.includes(userId)">
    <div>This user blocked you!</div>
    <button v-if="!isBlocked" @click="blockUser">Block back</button>
    <button v-else @click="unblockUser">Unblock</button>
  </div>
  <AddPost
    v-if="showNewPostForm"
    v-on:closeForm="showNewPostForm = !showNewPostForm"
    v-on:addPost="addPost"
    :initial-post="null"
    :post-type="'post'"
    :httpRequest="'POST'"
  >
  </AddPost>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "../api/axios";
import { useRoute } from "vue-router";
import Post from "../components/Post.vue";
import useAuthStore from "../stores/AuthStore";
import { storeToRefs } from "pinia";
import EditUserForm from "../components/EditUserForm.vue";
import AddPost from "../components/AddPost.vue";

const auth = useAuthStore();
const { login, follows, blocked, userId } = storeToRefs(auth);

const user = ref(null);
const posts = ref(null);
const replies = ref(null);
const route = useRoute();
const isFollowed = ref(null);
const isBlocked = ref(null);
const showPostType = ref("post");
const showUserUpdate = ref(false);
const showNewPostForm = ref(false);

onMounted(async () => {
  const username = route.params.username;
  try {
    const dbUser = await axios.get(`/users/${username}`);
    user.value = dbUser.data;
    await axios.get(`/posts/byUser/${user.value._id}`).then((res) => {
      posts.value = res.data.posts?.filter((el) => el.disabled === false);
      replies.value = res.data.comments?.filter((el) => el.disabled === false);
    });
    isFollowed.value = follows.value?.includes(user.value._id);
    isBlocked.value = blocked.value?.includes(user.value._id);
    window.onscroll = function () {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        if (showPostType.value === "post") {
          loadPagePosts();
        }
        if (showPostType.value === "comment") {
          loadPageComments();
        }
      }
    };
  } catch (err) {
    console.log(err.response);
    alert(err.response.data.message);
  }
});

const loadPagePosts = async () => {
  const nextPagePosts = await axios.get(
    `/posts/byUser/${user.value._id}?lastPostIndexId=${
      posts.value[posts.value.length - 1]._id
    }`
  );
  posts.value = posts.value.concat(nextPagePosts.data.posts);
};

const loadPageComments = async () => {
  const nextPageComments = await axios.get(
    `/posts/byUser/${user.value._id}?lastCommentIndexId=${
      replies.value[replies.value.length - 1]._id
    }`
  );
  replies.value = replies.value.concat(nextPageComments.data.comments);
};

const addPost = (post) => {
  posts.value = [post, ...posts.value];
};

const blockUser = async (e) => {
  e.preventDefault();
  isBlocked.value = !isBlocked.value;
  await axios.post("/users/block", { userId: user.value._id });
  auth.blockUser(user.value._id);
};

const unblockUser = async (e) => {
  e.preventDefault();
  isBlocked.value = !isBlocked.value;
  await axios.post("/users/unblock", { userId: user.value._id });
  auth.unblockUser(user.value._id);
};

const followUser = async (e) => {
  e.preventDefault();
  isFollowed.value = !isFollowed.value;
  await axios.post("/users/follow", { followedId: user.value._id });
  auth.followUser(user.value._id);
};

const unfollowUser = async (e) => {
  e.preventDefault();
  isFollowed.value = !isFollowed.value;
  await axios.post("/users/unfollow", { unfollowedId: user.value._id });
  auth.unfollowUser(user.value._id);
};
</script>
<style lang="scss" scoped>
#account {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
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
    width: 100%;
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
.user-account-actions {
  display: flex;
  gap: 0.5rem;
}
</style>
