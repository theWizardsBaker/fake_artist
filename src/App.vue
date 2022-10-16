<template>
  <div data-theme="business">
    <navigation>
      <template v-slot:title>
        <h1 class="text-2xl font-bold handwriting mr-1">Fake Artist</h1>
        <font-awesome-icon icon="fa-paintbrush" />
      </template>
      <template v-slot:right>
        <div
          class="flex items-center gap-2 text-gray-900 hover:text-accent hover:bg-gray-900 focus:text-accent focus:bg-gray-900 p-1 px-3 rounded cursor-pointer"
        >
          <font-awesome-icon icon="fa-circle-question" />
          How to play
        </div>
      </template>
    </navigation>
    <router-view v-slot="{ Component, route }">
      <FadeInOut :appear="true" entry="center" exit="center" :duration="500">
        <component :is="Component" />
      </FadeInOut>
    </router-view>
  </div>
</template>

<script>
import { FadeInOut } from "vue3-transitions";
import { mapState } from "vuex";
import { RouterView } from "vue-router";
import Navigation from "@/components/ui/Navigation.vue";
import store from "@/stores";

export default {
  name: "Fake Artist",

  components: {
    Navigation,
    RouterView,
    FadeInOut,
  },

  beforeMount() {
    // find if we already have an existing game
    // this.$socket.emit("game:find", "12345");
  },

  watch: {
    gameCode(code) {
      if (!!code) {
        this.$router.replace({ name: "game-lobby", params: { gameId: code } });
      } else {
        this.$router.replace({ name: "home" });
      }
    },

    inGame(inGame) {
      if (inGame) {
        this.$router.replace({
          name: "game-play",
          params: { gameId: this.gameCode },
        });
      }
    },
  },

  computed: {
    ...mapState({
      gameCode: (state) => state.lobby.code,
      inGame: (state) => state.game.inProgress,
    }),
  },

  sockets: {
    // gameFound() {
    //   alert("GAME FOUND!");
    // },
  },
};
</script>
