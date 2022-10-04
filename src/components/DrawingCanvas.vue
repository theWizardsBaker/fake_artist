<template>
  <div class="p-2 sm:p-10">
    <div class="flex flex-col gap-5" >
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
          class="btn btn-success btn-wide gap-3 ml-auto flex-grow sm:flex-grow-0"
          :disabled="!hasMarked"
        >
          <font-awesome-icon icon="fa-floppy-disk" class="fa-2xl" />
          <span class="pt-2">Save</span>
        </button>
      </div>
      <div>
        <vue-drawing-canvas
          :height="600"
          :width="600"
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
import VueDrawingCanvas from "vue-drawing-canvas";

export default {
  components: {
    VueDrawingCanvas,
  },

  mounted() {
    // get existing drawing from the backend
    // this.initialImage =
    // window.addEventListener('resize', this.getDimensions);
    // this.getCanvasDimensions()
  },

  props: {
    lockCanvas: {
      type: Boolean,
      default: false,
    },

    playerTurn: {
      type: Boolean,
      default: true,
    },

  },

  computed: {
    lineWidth() {
      return this.brushSizes[this.selectedBrush];
    },

    canvasLocked() {
      return this.hasMarked || !this.playerTurn;
    },
  },

  data() {
    return {
      hasMarked: false,
      selectedBrush: 0,
      brushSizes: [3, 5, 7],
      canvasSize: '400',
    };
  },

  methods: {

    brushIconSize(size) {
      return ["", "fa-xl", "fa-2xl"][size];
    },

    undoDrawing() {
      this.hasMarked = false;
      // weird issue where the canvas doesn't unlock fast enough
      setTimeout(this.$refs.VueCanvasDrawing.undo, 10);
    },

    // getCanvasDimensions() {
    //   console.log(this.$refs.VueCanvasDrawing)
    //   const containerWidthStr =  window.getComputedStyle(this.$refs.VueCanvasDrawing).width
    //   const digitRegex = /\d+/;
    //   this.canvasSize = digitRegex.exec(containerWidthStr)[0]
    // },

  },
};
</script>
