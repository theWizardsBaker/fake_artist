<template>
  <div class="p-2 sm:p-5">
    <div class="flex flex-col gap-5">
      <drawing-canvas-buttons
        v-if="enableDrawing"
        :disabled="!hasMarked || !isTurn"
        :loading="submitting"
        @submit="submitDrawing"
        @undo="undoDrawing"
        @brushSize="brushSize"
      />
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
          :height="htmlCanvasSize"
          :width="htmlCanvasSize"
          :lock="canvasLocked"
          :lineWidth="lineWidth"
          :color="color"
          :key="paths.length"
          :initialImage="filteredPaths"
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
import DrawingCanvasButtons from "./DrawingCanvasButtons.vue";
import { debounce } from "debounce";
import VueDrawingCanvas from "vue-drawing-canvas";
import { mapState } from "vuex";

export default {
  components: {
    VueDrawingCanvas,
    DrawingCanvasButtons,
  },

  props: {
    enableDrawing: {
      type: Boolean,
      default: true,
    },

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

    isTimeUp: {
      type: Boolean,
      default: false,
    },
  },

  async mounted() {
    window.addEventListener("visibilitychange", this.getAllDrawings);
    this.resizeCanvas(this.canvasSize);
  },

  unmounted() {
    window.removeEventListener("visibilitychange", this.getAllDrawings);
  },

  computed: {
    ...mapState({
      playerId: (state) => state.lobby.playerId,
      turn: (state) => state.game.playerTurn,
      filteredPlayer: (state) => state.game.selectedPlayer,
    }),

    canvasLocked() {
      return !this.isTurn || this.hasMarked || this.lockCanvas;
    },

    htmlCanvasSize() {
      return this.canvasSizes[this.size];
    },

    filteredPaths() {
      return this.paths.filter((path) => {
        if (this.filteredPlayer) {
          return path.player === this.filteredPlayer;
        }
        return true;
      });
    },
  },

  watch: {
    canvasSize(newVal, oldVal) {
      if (newVal !== oldVal) {
        if (this.$refs.VueCanvasDrawing) {
          this.paths = this.$refs.VueCanvasDrawing.getAllStrokes();
        }
        this.isRedrawingCanvasSize = true;
        this.resizeCanvas(newVal);
      }
    },

    isRedrawingCanvasSize(newVal) {
      if (newVal === false) {
        this.$nextTick(async () => {
          let c = document.getElementById(this.$refs.VueCanvasDrawing.canvasId);
          let d = c.getContext("2d");
          let scale = this.size / this.baseSize;
          d.scale(1, 1);
        });
      }
    },

    isTimeUp(newVal) {
      if (newVal && this.isTurn) {
        this.setMark();
        // emit a mouseup event so that the drawing is stopped
        let canvas = document.getElementById(
          this.$refs.VueCanvasDrawing.canvasId
        );
        canvas.dispatchEvent(new Event("mouseup"));
        // submit the drawing
        this.submitDrawing();
      }
    },
  },

  data() {
    return {
      canvasConversionWorker: new Worker("/workers/transform_coordinates.js"),
      isRedrawingCanvasSize: true,
      hasMarked: false,
      canvasSizes: [600, 400, 350, 250],
      size: 0,
      submitting: false,
      paths: [],
      lineWidth: 0,
    };
  },

  sockets: {
    async "success:set_drawing"(stroke) {
      const convertedStroke = await this.convertStrokes([stroke], false);
      this.paths.push(convertedStroke[0]);
      this.submitting = false;
      this.hasMarked = false;
    },

    async "success:get_all_drawings"(drawings) {
      this.paths = [];
      const convertedStrokes = await this.convertStrokes(drawings, false);
      this.paths = convertedStrokes;
    },

    "error:set_drawing"(path) {
      this.submitting = false;
    },
  },

  methods: {
    setMark() {
      this.hasMarked = true;
    },

    brushSize(size) {
      this.lineWidth = size;
    },

    undoDrawing() {
      this.hasMarked = false;
      // canvas doesn't unlock fast enough
      this.$nextTick(() => {
        this.$refs.VueCanvasDrawing.undo();
      });
    },

    resizeCanvas: debounce(function (size) {
      // find the right fit for the canvas
      for (let i = 0; i < this.canvasSizes.length; i++) {
        // const thisCanvasSize = this.canvasSizes[i];
        if (size <= this.canvasSizes[i]) {
          continue;
        }
        this.size = i;
        break;
      }
      // re-get strokes from the server
      this.getAllDrawings();
      this.isRedrawingCanvasSize = false;
    }, 1000),

    getAllDrawings: debounce(function () {
      this.$socket.emit("game:get_all_drawings");
    }, 1000),

    async submitDrawing() {
      // if the drawing has already been submitted, don't submit
      if (this.submitting) {
        return false;
      }
      this.submitting = true;
      await this.$nextTick();
      let lastStroke = this.$refs.VueCanvasDrawing.getAllStrokes().pop();
      // if the user hasn't marked, send empty coordinates
      if (!this.hasMarked) {
        lastStroke.coordinates = [];
      }
      let convertedStrokes = this.hasMarked
        ? await this.convertStrokes([lastStroke])
        : [];
      convertedStrokes[0].player = this.playerId;
      // send to other users
      this.$socket.emit("game:set_drawing", convertedStrokes[0]);
    },

    convertStrokes(strokes, enlarge = true) {
      // enlarge or reduce
      const start = enlarge ? this.canvasSizes[0] : this.htmlCanvasSize;
      const end = enlarge ? this.htmlCanvasSize : this.canvasSizes[0];

      return new Promise((resolve, reject) => {
        if (this.htmlCanvasSize !== this.canvasSizes[0]) {
          const convertedStrokes = strokes.map(async (s) => {
            const convertedValues = await this.convertPoints(start, end, s);
            s.from = convertedValues.from;
            s.coordinates = convertedValues.coordinates;
            return s;
          });
          // wait for all the conversions to be done
          Promise.all(convertedStrokes).then((data) => {
            resolve(data);
          });
        } else {
          resolve(strokes);
        }
      });
    },

    convertPoints(baseSize, currentSize, { from, coordinates }) {
      return new Promise((resolve, reject) => {
        const webWorker = new Worker("/workers/transform_coordinates.js");

        let results = {
          from: null,
          coordinates: null,
        };

        // convert the 'from'
        webWorker.postMessage({
          returnVal: "from",
          baseSize: baseSize,
          currentSize: currentSize,
          xyCoordinates: JSON.parse(JSON.stringify(from)),
        });

        // convert the coordinates
        webWorker.postMessage({
          returnVal: "coordinates",
          baseSize: baseSize,
          currentSize: currentSize,
          xyCoordinates: JSON.parse(JSON.stringify(coordinates)),
        });

        webWorker.onmessage = ({ data }) => {
          switch (data.returnVal) {
            case "from":
              results.from = data.result;
              break;
            case "coordinates":
              results.coordinates = data.result;
              break;
          }

          if (results.from !== null && results.coordinates !== null) {
            resolve(results);
          }
        };
      });
    },
  },
};
</script>
