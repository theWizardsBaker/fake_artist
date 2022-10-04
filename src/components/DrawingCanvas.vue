<template>
  <div class="p-2 sm:p-10">
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

        <button class="btn gap-3" @click.prevent="undoDrawing()">
          <font-awesome-icon icon="fa-eraser" class="fa-2xl" />
          <span class="pt-2">Undo</span>
        </button>

        <button
          class="btn btn-success sm:btn-wide gap-3 sm:ml-auto sm:flex-grow-0"
          :disabled="!hasMarked"
        >
          <font-awesome-icon icon="fa-floppy-disk" class="fa-2xl" />
          <span class="pt-2">Save</span>
        </button>
      </div>
      <div class="flex justify-center">
        <div v-if="isRedrawingCanvasSize">LOADING</div>
        <vue-drawing-canvas
          v-else
          :height="size"
          :width="size"
          ref="VueCanvasDrawing"
          :lock="canvasLocked"
          :lineWidth="lineWidth"
          lineCap="round"
          lineJoin="round"
          @mouseup="hasMarked = true"
          @touchend="hasMarked = true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "debounce";
import VueDrawingCanvas from "vue-drawing-canvas";

export default {
  components: {
    VueDrawingCanvas,
  },

  mounted() {
    // get existing drawing from the backend
    // this.initialImage =
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
  },

  computed: {
    lineWidth() {
      return this.brushSizes[this.selectedBrush];
    },

    canvasLocked() {
      return this.hasMarked || this.lockCanvas;
    },
  },

  watch: {
    canvasSize(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.isRedrawingCanvasSize = true;
        this.resizeCanvas(newVal);
      }
    },
  },

  data() {
    return {
      isRedrawingCanvasSize: true,
      hasMarked: false,
      selectedBrush: 0,
      brushSizes: [3, 5, 7],
      size: 0,
    };
  },

  methods: {
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
    }, 500),
  },
};
</script>
