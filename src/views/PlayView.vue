<template>
  <div class="min-h-screen bg-base-200">
    <!-- show players the topic -->
    <div class="flex justify-center pt-5">
      <game-topic />
    </div>
    <div class="flex justify-center">
      <div class="flex flex-col lg:flex-row">
        <div class="flex-initial hidden md:block place-self-center">
          <player-list showTurn />
          <button
            class="btn btn-info btn-outline btn-wide text-center rounded-2xl m-5 gap-2"
            @click="backToHome()"
          >
            Quit Game <font-awesome-icon icon="fa-x" />
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
            :isTurn="isTurn"
            :color="player.color"
          />
        </div>
        <div class="flex-auto place-self-center" v-show="selectedDisplay === 1">
          <player-list showTurn />
          <button
            class="btn btn-info btn-outline btn-wide text-center rounded-2xl m-5 gap-2"
            @click="backToHome()"
          >
            Quit Game <font-awesome-icon icon="fa-x" />
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
import PlayerList from "@/components/PlayerList.vue";
import GameTopic from "@/components/GameTopic.vue";
import DrawingCanvas from "@/components/DrawingCanvas.vue";
import { mapGetters, mapState } from "vuex";
import store from "@/stores";

export default {
  components: {
    PlayerList,
    GameTopic,
    DrawingCanvas,
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
  },

  data() {
    return {
      selectedDisplay: 0,
      displays: ["fa-paintbrush", "fa-users"],
      width: document.documentElement.clientWidth,
      canvasSize: "400",
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
