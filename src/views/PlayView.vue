<template>
  <div class="min-h-screen bg-base-200">
    <modal :show="showTurnNotification">
      <template v-slot:title> You're the artist! </template>
      <template v-slot:body>
        It's your turn, pick a brush size and draw a single mark on the canvas.
        <br />
        When you are finished click the `Save` button.
      </template>
      <template v-slot:action>
        <label class="btn btn-info" @click="showTurnNotification = false">
          Okay!
        </label>
      </template>
    </modal>
    <modal :show="showExitConfirmation">
      <template v-slot:title> Exit game? </template>
      <template v-slot:body>
        Quitting will end the game for all players. Are you sure you want to
        quit?
      </template>
      <template v-slot:action>
        <button class="btn btn-info" @click="showExitConfirmation = false">
          Cancel
        </button>
        <button
          class="btn btn-warning"
          @click="backToHome()"
          :disabled="!exitConfirmationEnabled"
        >
          Quit
        </button>
      </template>
    </modal>
    <!-- show players the topic -->
    <div class="flex justify-center pt-5">
      <game-topic />
    </div>
    <div class="flex justify-center">
      <div class="flex flex-col lg:flex-row">
        <div class="flex-initial hidden md:block place-self-center text-center">
          <player-list showTurn />
          <button
            class="btn btn-info btn-outline text-center rounded-2xl m-5 gap-2"
            @click="showExitConfirmation = true"
          >
            End Game <font-awesome-icon icon="fa-right-from-bracket" />
          </button>
        </div>
        <div
          class="flex-auto"
          v-show="selectedDisplay === 0"
          ref="canvas"
          :style="{ width: width, height: width }"
        >
          <drawing-canvas
            :canvasSize="canvasSize"
            :isTurn="isTurn && !isGameOver"
            :color="player.color"
          />
        </div>
        <div
          class="flex-auto place-self-center text-center"
          v-show="selectedDisplay === 1"
        >
          <player-list showTurn />
          <button
            class="btn btn-info btn-outline text-center rounded-2xl m-5 gap-2"
            @click="showExitConfirmation = true"
          >
            End Game <font-awesome-icon icon="fa-right-from-bracket" />
          </button>
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
import PlayerList from "@/components/PlayerList.vue";
import GameTopic from "@/components/GameTopic.vue";
import DrawingCanvas from "@/components/DrawingCanvas.vue";
import { mapGetters, mapState } from "vuex";

export default {
  name: "PlayGame",

  components: {
    PlayerList,
    GameTopic,
    DrawingCanvas,
    Modal,
  },

  // beforeRouteLeave (to, from , next) {
  //   // const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  //   // if (answer) {
  //   //   next()
  //   // } else {
  //   //   next(false)
  //   // }
  //   alert("EAVING")
  // },
  created() {
    // get turn
    this.$socket.emit("game:get_turn");
  },

  mounted() {
    window.addEventListener("resize", this.getWindowDimensions);
    this.$nextTick(() => {
      this.getCanvasDimensions();
    });
  },

  unmounted() {
    window.removeEventListener("resize", this.getWindowDimensions);
  },

  computed: {
    ...mapState({
      playerTurn: (state) => state.game.playerTurn,
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
        this.showTurnNotification = true;
      }
    },

    showExitConfirmation(newVal) {
      if (newVal) {
        setTimeout(() => (this.exitConfirmationEnabled = true), "2000");
      } else {
        this.exitConfirmationEnabled = false;
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
      showExitConfirmation: false,
      exitConfirmationEnabled: false,
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

    backToHome() {
      this.$router.replace({ name: "home" });
    },
  },
};
</script>
