<template>
  <navigation>
    <h1 class="text-2xl font-bold handwriting mr-1">Fake Artist</h1>
    <font-awesome-icon icon="fa-paintbrush" />
  </navigation>

  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'fade'">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
import { RouterView } from "vue-router";
import Navigation from "@/components/ui/Navigation.vue";

export default {
  name: "Fake Artist",

  components: {
    Navigation,
    RouterView,
  },

  beforeMount() {
    // find if we already have an existing game
    this.$socket.emit("game:find", "12345");
  },

  sockets: {
    gameFound() {
      alert("GAME FOUND!");
    },
  },
};
</script>
