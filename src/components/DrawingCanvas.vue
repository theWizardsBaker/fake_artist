<template>
  <div class="p-2 sm:p-5">
    <div class="flex flex-col gap-5">
      <div class="flex justify-center flex-wrap gap-5">
        <div class="btn-group rounded-2xl">
          <div
            v-for="(brush, brushInd) in brushSizes"
            :class="['btn', selectedBrush === brushInd && 'btn-active']"
            @click="selectedBrush = brushInd"
          >
            <font-awesome-icon
              icon="fa-circle"
              :class="brushIconSize(brushInd)"
            />
          </div>
        </div>

        <button
          class="btn gap-3"
          @click.prevent="undoDrawing()"
          :disabled="!hasMarked || !isTurn"
        >
          <font-awesome-icon icon="fa-eraser" class="fa-2xl" />
          <span class="pt-2">Undo</span>
        </button>

        <button
          :class="[
            'btn btn-success sm:btn-wide gap-3 sm:ml-auto sm:flex-grow-0',
            submitting && 'loading',
          ]"
          :disabled="!hasMarked || !isTurn"
          @click="submitDrawing"
        >
          <font-awesome-icon icon="fa-floppy-disk" class="fa-2xl" />
          <span class="pt-2">Save</span>
        </button>
      </div>
      <div class="flex justify-center items-center">

        <button
          v-if="isRedrawingCanvasSize"
          class="loading btn btn-outline btn-xl mt-10"
        >
          LOADING
        </button>
        <vue-drawing-canvas
          v-else
          ref="VueCanvasDrawing"
          :height="size"
          :width="size"
          :lock="canvasLocked"
          :lineWidth="lineWidth"
          :color="color"
          :key="paths.length"
          :initial-image="paths"
          lineCap="round"
          lineJoin="round"
          @mouseup="setMark"
          @touchend="setMark"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "debounce";
import VueDrawingCanvas from "vue-drawing-canvas";
import { mapState } from "vuex";

export default {
  components: {
    VueDrawingCanvas,
  },

  created() {
    // get existing drawing from the backend
    // this.paths =
  },

  props: {
    lockCanvas: {
      type: Boolean,
      default: false,
    },

    canvasSize: {
      type: String,
      default: "25",
    },

    isTurn: {
      type: Boolean,
      default: false,
    },

    color: {
      type: String,
      default: "#000000",
    },
  },

  computed: {
    ...mapState({
      playerId: (state) => state.lobby.playerId,
      turn: (state) => state.game.playerTurn,
    }),

    lineWidth() {
      return this.brushSizes[this.selectedBrush];
    },

    canvasLocked() {
      return !this.isTurn || this.hasMarked || this.lockCanvas;
    },
  },

  watch: {
    canvasSize(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.isRedrawingCanvasSize = true;
        this.resizeCanvas(newVal);
      }
    },
    isRedrawingCanvasSize(newVal) {
      if(newVal === false) {      
        this.$nextTick(async () => {
          let c = document.getElementById(this.$refs.VueCanvasDrawing.canvasId);
          let d = c.getContext("2d");
          console.log(d.scale(.5, .5));
        });
      }
    }
  },

  data() {
    return {
      isRedrawingCanvasSize: true,
      hasMarked: false,
      selectedBrush: 0,
      brushSizes: [3, 5, 7],
      size: 0,
      submitting: false,
      paths: [],
    };
  },

  sockets: {
    async "success:set_drawing"(path) {
      // await nextTick();
      this.paths.push(path);
      this.submitting = false;
      this.hasMarked = false;
      // await this.$refs.VueCanvasDrawing.redraw();
      // this.$nextTick(async () => {
      // });
    },
    "error:set_drawing"(path) {
      this.submitting = false;
    },
  },

  methods: {
    setMark() {
      this.hasMarked = true;
    },

    brushIconSize(size) {
      return ["", "fa-xl", "fa-2xl"][size];
    },

    undoDrawing() {
      this.hasMarked = false;
      // canvas doesn't unlock fast enough
      this.$nextTick(() => {
        this.$refs.VueCanvasDrawing.undo();
      });
    },

    resizeCanvas: debounce(function (size) {
      this.size = size - 40;
      this.isRedrawingCanvasSize = false;
    }, 1000),

    submitDrawing() {
      this.submitting = true;
      let lastStroke = this.$refs.VueCanvasDrawing.getAllStrokes().slice(-1);
      console.log(lastStroke);
      // tag the player who drew the stroke
      lastStroke[0].player = this.playerId;
      this.$socket.emit("game:set_drawing", lastStroke[0]);
    },
  },
};
</script>
