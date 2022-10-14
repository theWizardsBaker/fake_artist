<template>
  <div data-theme="business">
    <navigation>
      <h1 class="text-2xl font-bold handwriting mr-1">Fake Artist</h1>
      <font-awesome-icon icon="fa-paintbrush" />
    </navigation>

    <router-view v-slot="{ Component, route }">
      <FadeInOut :appear="true" entry="center" exit="center" :duration="500">
        <component :is="Component" />
      </FadeInOut>
    </router-view>
  </div>
</template>

<script>
import { FadeInOut } from 'vue3-transitions'
import { mapState } from "vuex";
import { RouterView } from "vue-router";
import Navigation from "@/components/ui/Navigation.vue";
import store from "@/stores";

export default {
  name: "Fake Artist",

  components: {
    Navigation,
    RouterView,
    FadeInOut
  },

  beforeMount() {
    // find if we already have an existing game
    // this.$socket.emit("game:find", "12345");
  },

  watch: {
    gameId(gameId) {
      this.$router.push({ name: 'player-create', params: { gameId: gameId } })
    },
  },

  computed: {
    ...mapState({
      gameId: (state) => state.lobby.gameId,
    }),
  },

  sockets: {
    // gameFound() {
    //   alert("GAME FOUND!");
    // },
  },
};
</script>
