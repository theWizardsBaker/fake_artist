<template>
  <main>
    <button
      class="btn btn-square btn-info btn-outline text-center rounded-2xl m-5 gap-2 sm:absolute sm:right-0 float-right sm:block hidden"
      @click="backToHome()"
    >
      <font-awesome-icon icon="fa-x" />
    </button>
    <base-page>
      <div class="max-w-md">
        <div class="flex flex-col">
          <div class="sm:relative m-2">
            <button
              class="btn btn-square btn-info btn-outline text-center rounded-2xl m-5 gap-2 sm:absolute sm:right-0 float-right sm:hidden"
              @click="backToHome()"
            >
              <font-awesome-icon icon="fa-x" />
            </button>
          </div>
          <div class="p-4 text-center text-primary-content">
            <label>Game Code</label>
            <h3
              class="font-medium text-6xl my-3 border-2 border-primary-content p-3 rounded-2xl"
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
            <button
              v-if="isLeader"
              :class="[
                'btn btn-success text-center mx-5 my-3 gap-2',
                players.length >= this.minPlayers && 'animate-pulse',
              ]"
              :disabled="players.length < this.minPlayers"
              @click="startGame()"
            >
              <span>Start Game</span>
              <font-awesome-icon icon="fa-right-from-bracket" />
            </button>
            <player-list showReady />
          </card>
        </div>
      </div>
    </base-page>
  </main>
</template>

<script>
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
  },

  beforeUnmount() {
    // if the player navigates away from the page
    // send an 'exit' signal
    if (!this.gameInProgress) {
      this.exitGame();
    }
  },

  components: {
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
