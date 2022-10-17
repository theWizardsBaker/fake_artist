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
      <!--       <FadeInOut :appear="true" entry="center" exit="center" :duration="500">
 -->
      <component :is="Component" />
      <!--       </FadeInOut>
 -->
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

  created() {
    // check and see if a game is in progress
    this.$socket.emit("lobby:rejoin", this.gameCode);
  },

  beforeMount() {
    // find if we already have an existing game
    // this.$socket.emit("game:find", "12345");
  },

  watch: {
    gameCode(code) {
      if (!!code) {
        this.goToLobby();
      } else {
        this.goHome();
      }
    },

    inGame(inGame) {
      if (inGame) {
        this.goToGame();
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
    "success:lobby_rejoin_game"() {
      this.goToGame();
    },

    "success:lobby_rejoin_lobby"() {
      this.goToLobby();
    },

    "error:lobby_rejoin"() {
      this.goHome();
    },
  },

  methods: {
    goToGame() {
      this.$router.replace({
        name: "game-play",
        params: { gameId: this.gameCode },
      });
    },

    goToLobby() {
      this.$router.push({
        name: "game-lobby",
        params: { gameId: this.gameCode },
      });
    },

    goHome() {
      this.$router.replace({ name: "home" });
    },
  },
};
</script>
