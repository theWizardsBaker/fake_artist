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
          :height="htmlCanvasSize"
          :width="htmlCanvasSize"
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

    htmlCanvasSize() {
      return this.canvasSizes[this.size];
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
      const round = (num) => +(Math.round(num + "e+2") + "e-2");

      if (newVal === false) {
        this.$nextTick(async () => {
          let c = document.getElementById(this.$refs.VueCanvasDrawing.canvasId);
          let d = c.getContext("2d");
          let scale = this.size / this.baseSize;
          // console.log(round(scale), this.baseSize, this.size)
          d.scale(1, 1);
        });
      }
    },
  },

  data() {
    return {
      canvasConversionWorker: new Worker("/workers/transform_coordinates.js"),
      isRedrawingCanvasSize: true,
      hasMarked: false,
      selectedBrush: 0,
      brushSizes: [3, 5, 7],
      canvasSizes: [600, 400, 300, 200],
      size: 0,
      submitting: false,
      paths: [],
    };
  },

  sockets: {
    async "success:set_drawing"(stroke) {
      if (this.htmlCanvasSize !== this.canvasSizes[0]) {
        const convertedValues = await this.convertDrawing(
          this.htmlCanvasSize,
          this.canvasSizes[0],
          stroke
        );
        stroke.from = convertedValues.from;
        stroke.coordinates = convertedValues.coordinates;
      }
      this.paths.push(stroke);
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
      // find the right fit for the canvas
      for (let i = 0; i < this.canvasSizes.length; i++) {
        const thisCanvasSize = this.canvasSizes[i];
        if (size <= thisCanvasSize) {
          continue;
        }
        this.size = i;
        break;
      }
      this.isRedrawingCanvasSize = false;
    }, 1000),

    async submitDrawing() {
      this.submitting = true;
      await this.$nextTick();

      let lastStroke = this.$refs.VueCanvasDrawing.getAllStrokes().pop();
      // convert to general canvas size
      if (this.htmlCanvasSize !== this.canvasSizes[0]) {
        const convertedValues = await this.convertDrawing(
          this.canvasSizes[0],
          this.htmlCanvasSize,
          lastStroke
        );
        lastStroke.from = convertedValues.from;
        lastStroke.coordinates = convertedValues.coordinates;
      }
      // tag the player who drew the stroke
      lastStroke.player = this.playerId;
      // send to other users
      this.$socket.emit("game:set_drawing", lastStroke);

      // let lastStroke = this.$refs.VueCanvasDrawing.strokes;
    },

    convertDrawing(baseSize, currentSize, { from, coordinates }) {
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
