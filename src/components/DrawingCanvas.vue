<template>
  <div class="p-2 sm:p-5">
    <div class="flex flex-col gap-5">
      <drawing-canvas-buttons
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
          :initialImage="paths"
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

  created() {
    // get existing drawing from the backend
    // this.paths =

    this.focused = window.document.hasFocus();

    window.addEventListener("blur", this.isUnfocused);
    window.addEventListener("focus", this.isFocused);

    // this.getAllDrawings();
  },

  destroyed() {
    window.removeEventListener("blur", this.isUnfocused);
    window.removeEventListener("focus", this.isFocused);
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

    canvasLocked() {
      return !this.isTurn || this.hasMarked || this.lockCanvas;
    },

    htmlCanvasSize() {
      return this.canvasSizes[this.size];
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
    focused(newVal) {
      if (newVal) {
        // get anything we might have missed
        // this.getAllDrawings();
      }
    },
  },

  data() {
    return {
      focused: false,
      canvasConversionWorker: new Worker("/workers/transform_coordinates.js"),
      isRedrawingCanvasSize: true,
      hasMarked: false,
      canvasSizes: [600, 400, 300, 200],
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
      // await this.$refs.VueCanvasDrawing.redraw();
      // this.$nextTick(async () => {
      // });
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
    isUnfocused() {
      this.focused = false;
    },

    isFocused() {
      this.focused = true;
    },

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
        const thisCanvasSize = this.canvasSizes[i];
        if (size <= thisCanvasSize) {
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
      this.submitting = true;
      await this.$nextTick();

      let lastStroke = this.$refs.VueCanvasDrawing.getAllStrokes().pop();
      let convertedStrokes = await this.convertStrokes([lastStroke]);
      convertedStrokes[0].player = this.playerId;
      // send to other users
      this.$socket.emit("game:set_drawing", convertedStrokes[0]);

      // let lastStroke = this.$refs.VueCanvasDrawing.strokes;
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
