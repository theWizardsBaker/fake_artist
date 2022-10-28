<template>
  <div class="flex justify-center flex-wrap gap-5">
    <div class="btn-group rounded-2xl">
      <div
        v-for="(brush, brushInd) in brushSizes"
        :class="[
          'btn btn-sm sm:btn-md',
          selectedBrush === brushInd && 'btn-active',
        ]"
        @click="selectBrush(brushInd)"
      >
        <font-awesome-icon icon="fa-circle" :class="brushIconSize(brushInd)" />
      </div>
    </div>

    <button
      class="btn gap-3 btn-sm sm:btn-md"
      @click.prevent="undoDrawing()"
      :disabled="disabled"
    >
      <font-awesome-icon icon="fa-eraser" class="fa-xl text-lg sm:text-3xl" />
      <span>Undo</span>
    </button>

    <button
      :class="[
        'btn btn-success btn-sm sm:btn-md sm:btn-wide gap-3 sm:ml-auto sm:flex-grow-0',
        loading && 'loading',
      ]"
      :disabled="disabled"
      @click="submitDrawing"
    >
      <font-awesome-icon
        icon="fa-floppy-disk"
        class="fa-xl text-lg sm:text-3xl"
      />
      <span>Save</span>
    </button>
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
    this.selectBrush(0);
  },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      selectedBrush: 0,
      brushSizes: [3, 5, 7],
      submitting: false,
    };
  },

  methods: {
    brushIconSize(size) {
      return [
        "text-xs sm:text-sm",
        "text-lg sm:text-2xl",
        "text-2xl sm:text-4xl",
      ][size];
    },

    selectBrush(ind) {
      this.selectedBrush = ind;
      this.$emit("brushSize", this.brushSizes[this.selectedBrush]);
    },

    undoDrawing() {
      this.$emit("undo");
    },

    submitDrawing() {
      this.$emit("submit");
    },
  },
};
</script>
