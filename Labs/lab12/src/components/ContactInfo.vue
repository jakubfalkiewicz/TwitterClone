<template>
  <li>
    <h2>{{ name }} <img v-if="this.friendProp" class="friendIcon" src="friends.png" alt=""></h2>
    <button @click="showHideFriend">{{ addRemove }}</button>
    <button @click="showHideDetails">Ukryj/Pokaż szczegóły</button>
    <details-vue v-if="details" :phoneNumber="this.phoneNumber" :emailAddress="this.emailAddress">

    </details-vue>
  </li>
</template>

<script>
import DetailsVue from "./Details.vue";

export default {
  props: ['name', 'phoneNumber', 'emailAddress', 'friend'],
  data() {
    return {
      addRemove: this.friend ? "Usuń ze znajomych" : "Dodaj do znajomych",
      friendProp: this.friend,
      details: false
    };
  },
  methods:{
    showHideFriend(){
      this.friendProp ? this.addRemove = "Dodaj do znajomych" : this.addRemove = "Usuń ze znajomych";
      this.friendProp = !this.friendProp
    },
    showHideDetails(){
      console.log("details")
      console.log(this.details)
      this.details = !this.details
    }
  },
  components: {
    DetailsVue
  },
};

</script>

<style>
  .friendIcon {
    margin-left: 10px;
    width: 30px;
  }
</style>
