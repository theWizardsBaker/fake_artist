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
        @offsetPosition="offsetPosition"
        class="drawing-button"
      />
      <div class="flex justify-center items-center">
        <button
          v-if="isRedrawingCanvasSize || isLoadingDrawing"
          class="loading btn btn-outline btn-xl mt-10"
        >
          LOADING
        </button>
        <vue-canvas
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
          @mousedown="startMark"
          @touchstart="startMark"
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
// import VueDrawingCanvas from "vue-drawing-canvas";
import VueCanvas from "@/components/ui/Canvas.vue";
import { mapState } from "vuex";

export default {
  components: {
    // VueDrawingCanvas,
    VueCanvas,
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
      return (
        !this.isTurn ||
        this.hasMarked ||
        this.lockCanvas ||
        this.isLoadingDrawing
      );
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
      const canvas = this.$refs.VueCanvasDrawing;
      if (newVal === false && canvas) {
        this.$nextTick(async () => {
          let c = document.getElementById(canvas.canvasId);
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
      isLoadingDrawing: true,
      offset: 'none',
      offsetTranslations: {
        left: [-25, -25],
        right: [25, -25],
        none: [0, 0]
      }
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
      this.isLoadingDrawing = false;
    },

    "error:set_drawing"(path) {
      this.submitting = false;
    },
  },

  methods: {
    setMark() {
      // const canvas = document.getElementById(
      //   this.$refs.VueCanvasDrawing.canvasId
      // );

      // console.log('ALL STROKES', this.$refs.VueCanvasDrawing.getAllStrokes())
      // let allStrokes = this.$refs.VueCanvasDrawing.getAllStrokes()
      // let lastStroke = allStrokes.pop();
      // console.log(lastStroke)
      // this.$refs.VueCanvasDrawing.reset()

      // this.$refs.VueCanvasDrawing.getAllStrokes().push(lastStroke)

      // const context = canvas.getContext("2d");
      // context.translate(this.offsetTranslations[this.offset][0] * -1, this.offsetTranslations[this.offset][1] * -1)

      // canvas.redraw();
      // get the 2d context
      // context.restore();
      // context.setTransform(1, 0, 0, 1, 0, 0);

      if (!this.canvasLocked) {
        this.hasMarked = true;
      }
    },

    brushSize(size) {
      this.lineWidth = size;
    },

    offsetPosition(offset) {
      this.offset = offset;
    },

    startMark() {

      // this.isLoadingDrawing = true;
      
      if(this.$refs.VueCanvasDrawing) {
        // get the canvas
        // const canvas = document.getElementById(
        //   this.$refs.VueCanvasDrawing.canvasId
        // );
        // get the 2d context
        // const context = canvas.getContext("2d");
        // context.save();
        // if we have an old set, reset to 0
        // if(oldOffset){
        //   // translate back to center
        //   let x = this.offsetTranslations[oldOffset][0] * -1;
        //   let y = this.offsetTranslations[oldOffset][1] * -1;
        //   context.translate(x, y)
        // }
        // context.translate(this.offsetTranslations[this.offset][0], this.offsetTranslations[this.offset][1])

        // // convert all the paths to use the offset
        // const convertedStrokes = this.paths.map(async (s) => {
        //   const convertedValues = await this.convertPoints(
        //     this.htmlCanvasSize,
        //     this.htmlCanvasSize,
        //     [0,0],
        //     s,
        //   );
        //   s.from = convertedValues.from;
        //   s.coordinates = convertedValues.coordinates;
        //   return s;
        // });

        // // wait for all the conversions to be done
        // const strokes = await Promise.all(convertedStrokes)
        // context.transform(1, 0, 1, 0, .2, .2);

        // console.log(JSON.parse(JSON.stringify(this.paths)))
        // console.log(JSON.parse(JSON.stringify(strokes)))

        // this.paths = convertedStrokes;

           // this.$nextTick();

        // })

      }

      // this.isLoadingDrawing = false;
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
        if (this.htmlCanvasSize === this.canvasSizes[0]) {
          resolve(strokes);
        }

        const convertedStrokes = strokes.map(async (s) => {
          const convertedValues = await this.convertPoints(
            start,
            end,
            this.offsetTranslations[this.offset],
            s,
          );
          s.from = convertedValues.from;
          s.coordinates = convertedValues.coordinates;
          return s;
        });

        // wait for all the conversions to be done
        Promise.all(convertedStrokes).then((data) => {
          resolve(data);
        });

      });
    },

    convertPoints(baseSize, currentSize, xyOffset, { from, coordinates }) {
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
          xyOffset: {
            x: xyOffset[0] * -1,
            y: xyOffset[1] * -1,
          }
        });

        // convert the coordinates
        webWorker.postMessage({
          returnVal: "coordinates",
          baseSize: baseSize,
          currentSize: currentSize,
          xyCoordinates: JSON.parse(JSON.stringify(coordinates)),
          xyOffset: {
            x: xyOffset[0] * -1,
            y: xyOffset[1] * -1,
          }
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
