<template>
  <div class="min-h-screen bg-base-200">
    <count-down :start="startTurn" v-if="isTurn" @done="isTimeUp = true" />
    <modal :show="showTurnNotification">
      <template v-slot:title> It's your turn! </template>
      <template v-slot:body>
        You're the artist. Add to the drawing by making a single stroke on the
        canvas.
      </template>
      <template v-slot:action>
        <label
          class="btn btn-info"
          @click="
            showTurnNotification = false;
            startTurn = true;
          "
        >
          Okay!
        </label>
      </template>
    </modal>
    <!-- show players the topic -->
    <div class="flex justify-center pt-5">
      <game-topic />
    </div>
    <div class="flex justify-center">
      <div class="flex flex-col lg:flex-row items-start">
        <div class="flex-initial hidden md:block place-self-center text-center">
          <player-list showTurn />
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
          />
        </div>
        <div
          class="flex-auto place-self-center text-center"
          v-show="selectedDisplay === 1"
        >
          <player-list showTurn />
          <game-exit-button />
        </div>
      </div>
    </div>
    <!-- Bottom buttons on mobile devices -->
    <div class="btm-nav btm-nav-sm md:hidden">
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
import { mapGetters, mapState } from "vuex";

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

  created() {
    // get turn
    this.$socket.emit("game:get_turn");
  },

  mounted() {
    window.addEventListener("resize", this.getWindowDimensions);
    this.$nextTick(() => {
      this.getCanvasDimensions();
    });
    if (this.isTurn) {
      this.showTurnNotification = true;
    }
  },

  unmounted() {
    window.removeEventListener("resize", this.getWindowDimensions);
  },

  computed: {
    ...mapState({
      playerId: (state) => state.lobby.playerId,
      playerTurn: (state) => state.game.playerTurn,
      inProgress: (state) => state.game.inProgress,
      round: (state) => state.game.round,
      maxRounds: (state) => state.game.maxRounds,
    }),

    ...mapGetters({
      player: "lobby/player",
      players: "lobby/orderedPlayers",
      isGameOver: "game/isGameOver",
    }),

    isTurn() {
      return this.player.order === this.playerTurn;
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
      canvasSize: "400",
      showTurnNotification: false,
      startTurn: false,
      isTimeUp: false,
    };
  },

  methods: {
    getWindowDimensions() {
      this.width = document.documentElement.clientWidth;
    },

    getCanvasDimensions() {
      const containerWidthStr = window.getComputedStyle(
        this.$refs.canvas
      ).width;
      const digitRegex = /\d+/;
      this.canvasSize = digitRegex.exec(containerWidthStr)[0];
    },
  },
};
</script>
