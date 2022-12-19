<template>
  <main>
    <modal :show="showExitConfirmation">
      <template v-slot:title> Leave Lobby? </template>
      <template v-slot:action>
        <label class="btn btn-info" @click="showExitConfirmation = false">
          Stay
        </label>
        <label class="btn btn-error" @click="backToHome()"> Leave </label>
      </template>
    </modal>
    <base-page>
      <div class="max-w-md">
        <div class="flex flex-col">
          <div class="p-4 text-center text-base-content">
            <label>Game Code</label>
            <h3
              class="font-medium text-6xl my-3 border-2 border-base-content p-3 rounded-2xl"
            >
              {{ $route.params.gameId }}
            </h3>
          </div>
          <card>
            <div class="form-control mb-3">
              <label class="input-group">
                <span>Brush Color</span>
                <v-swatches
                  id="swatch"
                  v-model="color"
                  :swatches="swatches"
                  swatch-size="54"
                  background-color="white"
                  show-border
                  inline
                />
              </label>
            </div>
            <player-list showReady />
            <button
              class="btn btn-info btn-outline text-center text-lg rounded-2xl m-5 mt-8 mb-3 gap-2"
              @click="showExitConfirmation = true"
            >
              Leave Game Lobby
              <font-awesome-icon icon="fa-right-from-bracket" />
            </button>
            <button
              v-if="isLeader"
              :class="[
                'btn btn-success text-center mx-5 my-3 rounded-2xl text-lg gap-2',
                players.length >= this.minPlayers && 'animate-pulse',
              ]"
              :disabled="players.length < this.minPlayers"
              @click="startGame()"
            >
              <span>Start Game</span>
              <font-awesome-icon icon="fa-play" />
            </button>
          </card>
        </div>
      </div>
    </base-page>
  </main>
</template>

<script>
import Modal from "@/components/ui/Modal.vue";
import Card from "@/components/ui/Card.vue";
import BasePage from "@/components/ui/BasePage.vue";
import PlayerList from "@/components/PlayerList.vue";
import VSwatches from "vue3-swatches";
import { mapGetters, mapState } from "vuex";
import store from "@/stores";

export default {
  name: "GameLobby",

  created() {
    // end an old game if one existed
    store.dispatch("game/endGame");

    window.addEventListener("visibilitychange", this.fetchPlayers);
  },

  beforeUnmount() {
    // if the player navigates away from the page
    // send an 'exit' signal
    if (!this.gameInProgress) {
      this.exitGame();
    }
    window.removeEventListener("visibilitychange", this.fetchPlayers);
  },

  components: {
    Modal,
    PlayerList,
    VSwatches,
    BasePage,
    Card,
  },

  computed: {
    ...mapState({
      players: (state) => state.lobby.players,
      playerId: (state) => state.lobby.playerId,
      gameInProgress: (state) => state.game.inProgress,
      code: (state) => state.lobby.code,
    }),
    ...mapGetters({
      swatches: "lobby/colorSwatches",
      isLeader: "lobby/isLeader",
    }),
  },

  watch: {
    color(newColor, oldColor) {
      // if the color is not disabled
      if (this.swatches.find((s) => s.color === newColor && s.disabled)) {
        this.color = oldColor;
      } else {
        this.$socket.emit("colors:update", this.playerId, newColor);
      }
    },
  },

  data() {
    return {
      color: "",
      ready: false,
      minPlayers: 3,
      showExitConfirmation: false,
    };
  },

  sockets: {
    "error:colors_updated"(colors) {
      this.color = "";
    },
  },

  methods: {
    startGame() {
      if (this.players.length >= this.minPlayers) {
        this.$socket.emit("game:start");
      }
    },

    exitGame() {
      this.$socket.emit("lobby:quit", this.playerId);
    },

    backToHome() {
      this.$router.replace({ name: "home" });
    },

    fetchPlayers() {
      this.$socket.emit("lobby:fetch_players", this.code);
    },
  },
};
</script>

<style>
div.vue-swatches__swatch--is-disabled {
  opacity: 20% !important;
}

div.vue-swatches__swatch {
  margin: 8px !important;
}
</style>
