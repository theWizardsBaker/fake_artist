<template>
  <div class="min-h-screen bg-base-200 pt-10">
    <count-down v-if="timeLimit && isTurn" :start="startTurn" @done="isTimeUp = true" />
    <modal :show="showTurnNotification">
      <template v-slot:title> It's your turn! </template>
      <template v-slot:body>
        You're the artist. Add to the drawing by making a single stroke on the
        canvas.
      </template>
      <template v-slot:action>
        <label class="btn btn-info" @click="confirmTurnStart"> Okay! </label>
      </template>
    </modal>
    <!-- show players the topic -->
    <div class="flex justify-center pt-5">
      <game-topic />
    </div>
    <div class="flex justify-center mb-10">
      <div class="flex flex-col lg:flex-row items-start">
        <div
          class="flex-initial hidden md:block place-self-center lg:place-self-start lg:pt-5 text-center"
        >
          <player-list
            @selected="filterPlayer"
            showTurn
            :showSelect="!isTurn"
            :directions="playerDirection"
          />
          <game-exit-button />
        </div>
        <div
          class="flex-auto mb-10"
          v-show="selectedDisplay === 0"
          ref="canvas"
          :style="{ width: width, height: width }"
        >
          <drawing-canvas
            :canvasSize="canvasSize"
            :isTurn="isTurn && !isGameOver"
            :isTimeUp="isTimeUp"
            :color="player.color"
            :canvasLocked="unlockedCanvas"
          />
          <div class="text-center md:hidden" v-show="!isTurn">
            {{ currentPlayer.name }} is drawing
          </div>
        </div>
        <div
          class="flex-auto place-self-start text-center"
          v-show="selectedDisplay === 1"
        >
          <player-list
            @selected="filterPlayer"
            showTurn
            :showSelect="!isTurn"
            :directions="playerDirection"
          />
          <game-exit-button />
        </div>
      </div>
    </div>
    <!-- Bottom buttons on mobile devices -->
    <div class="btm-nav btm-nav-xs md:hidden">
      <button
        v-for="(display, displayInd) in displays"
        :class="[selectedDisplay === displayInd && 'active']"
        @click="selectedDisplay = displayInd"
      >
        <span class="btm-nav-label">
          <font-awesome-icon :icon="display" class="fa-2xl" />
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import Modal from "@/components/ui/Modal.vue";
import CountDown from "@/components/ui/CountDown.vue";
import PlayerList from "@/components/PlayerList.vue";
import GameTopic from "@/components/GameTopic.vue";
import DrawingCanvas from "@/components/DrawingCanvas.vue";
import GameExitButton from "@/components/GameExitButton.vue";
import { mapGetters, mapState, mapActions } from "vuex";

export default {
  name: "PlayGame",

  components: {
    PlayerList,
    GameTopic,
    DrawingCanvas,
    Modal,
    GameExitButton,
    CountDown,
  },

  async mounted() {
    window.addEventListener("visibilitychange", this.getTurn);

    window.addEventListener("resize", this.getWindowDimensions);
    // wait for the canvas to be ready
    await this.$nextTick();
    // get the dimensions
    this.getCanvasDimensions();

    if (this.isTurn) {
      this.showTurnNotification = true;
    }

    window.scrollTo(0, 0);
  },

  unmounted() {
    window.removeEventListener("resize", this.getWindowDimensions);
    window.removeEventListener("visibilitychange", this.getTurn);
  },

  computed: {

    ...mapState({
      playerId: (state) => state.lobby.playerId,
      playerTurn: (state) => state.game.playerTurn,
      inProgress: (state) => state.game.inProgress,
      round: (state) => state.game.round,
      maxRounds: (state) => state.game.maxRounds,
      timeLimit: (state) => state.game.timeLimit,
    }),

    ...mapGetters({
      player: "lobby/player",
      players: "lobby/orderedPlayers",
      isGameOver: "game/isGameOver",
    }),

    isTurn() {
      return this.player.order === this.playerTurn;
    },

    unlockedCanvas() {
      return this.isTurn && this.startTurn;
    },

    currentPlayer() {
      return this.players[this.playerTurn];
    },
  },

  watch: {
    width(newDisplay, oldDisplay) {
      this.selectedDisplay = 0;
      this.getCanvasDimensions();
    },

    isTurn(newVal) {
      if (newVal) {
        this.isTimeUp = false;
        this.showTurnNotification = true;
        this.filterPlayer(null);
      } else {
        this.startTurn = false;
      }
    },

    isGameOver(newVal) {
      this.$router.replace({ name: "game-vote" });
    },
  },

  data() {
    return {
      selectedDisplay: 0,
      displays: ["fa-paintbrush", "fa-users"],
      width: document.documentElement.clientWidth,
      canvasSize: 400,
      showTurnNotification: false,
      startTurn: false,
      isTimeUp: false,
      playerDirection: "Select a player to see only their drawings",
    };
  },

  methods: {
    ...mapActions({
      filterPlayer: "game/filterPlayer",
    }),

    getWindowDimensions() {
      this.width = document.documentElement.clientWidth;
    },

    getCanvasDimensions() {
      const containerWidthStr = window.getComputedStyle(
        this.$refs.canvas
      ).width;
      const digitRegex = /\d+/;
      this.canvasSize = parseInt(digitRegex.exec(containerWidthStr)[0]);
    },

    async getTurn() {
      await this.$nextTick();
      // only look if the window is visible
      if (document.visibilityState === "visible") {
        // get turn
        this.$socket.emit("game:get_turn");
      }
    },

    confirmTurnStart() {
      this.showTurnNotification = false;
      // delay turn start so that an accidental click doesn't happen
      setTimeout(() => (this.startTurn = true), 50);
    },
  },
};
</script>
