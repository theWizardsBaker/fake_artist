<template>
  <div :data-theme="selectedTheme">
    <navigation>
      <template v-slot:title>
        <div class="mx-10 sm:m-0 flex items-center">
          <h1 class="text-4xl sm:text-2xl font-bold handwriting mr-1">
            Fake Artist
          </h1>
          <font-awesome-icon icon="fa-paintbrush" />
        </div>
      </template>
      <template v-slot:right>
        <div>
          <select
            v-model="theme"
            class="select select-bordered select-xs w-full max-w-xs capitalize"
          >
            <option v-for="(t, ind) in themes" :value="ind">
              {{ t }}
            </option>
          </select>
        </div>
        <div
          class="flex items-center gap-2 hover:text-primary-content focus:text-primary-content p-1 px-3 rounded cursor-pointer"
          @click="showHowToPlay = !showHowToPlay"
        >
          <font-awesome-icon icon="fa-circle-question" />
          How to play
        </div>
      </template>
    </navigation>
    <modal
      :show="showHowToPlay"
      @backgroundClick="showHowToPlay = false"
      showClose
    >
      <template v-slot:title> How To Play </template>
      <template v-slot:body>
        A group of players must work together to find the one
        <b>fake artist</b> among them. The fake artist tries to avoid detection.
        <br />
        <br />
        When the game begins, players see the round's random topic,
        <i>e.g. "Apple"</i>. The exception is for the fake artist, they will
        only see <i>"???"</i>.
        <br />
        <br />
        Players take turns drawing single strokes on the canvas. After everyone
        has drawn (2 times by default), players vote on who they think the fake
        artist is.
        <br />
        <br />
        The fake artist wins if they don't get the majority vote.
        <br />
        <br />
        But even if the fake artist gets caught, they get one chance to guess
        the topic. If they guess correctly, they win!
      </template>
    </modal>
    <router-view v-slot="{ Component, route }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { RouterView } from "vue-router";
import Navigation from "@/components/ui/Navigation.vue";
import Modal from "@/components/ui/Modal.vue";

export default {
  name: "Fake Artist",

  components: {
    Navigation,
    RouterView,
    Modal,
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

    ...mapGetters({
      isGameOver: "game/isGameOver",
    }),

    selectedTheme() {
      return this.themes[this.theme];
    },
  },

  data() {
    return {
      theme: 2,
      themes: ["autumn", "business", "cupcake", "pastel"],
      showHowToPlay: false,
    };
  },

  sockets: {
    "success:lobby_rejoin_game"() {
      if (this.$router.name !== "game-play") {
        if (this.isGameOver) {
          this.goToVote();
        } else {
          this.goToGame();
        }
      }
    },

    "success:lobby_rejoin_lobby"() {
      if (this.$router.name !== "game-lobby") {
        this.goToLobby();
      }
    },

    "error:lobby_rejoin"() {
      this.goHome();
    },
  },

  methods: {
    goToVote() {
      this.$router.replace({
        name: "game-vote",
        params: { gameId: this.gameCode },
      });
    },

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
