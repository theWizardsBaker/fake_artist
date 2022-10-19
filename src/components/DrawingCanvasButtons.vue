<template>
  <div class="flex justify-center flex-wrap gap-5">
    <div class="btn-group rounded-2xl">
      <div
        v-for="(brush, brushInd) in brushSizes"
        :class="['btn', selectedBrush === brushInd && 'btn-active']"
        @click="selectBrush(brushInd)"
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
      :disabled="disabled"
    >
      <font-awesome-icon icon="fa-eraser" class="fa-2xl" />
      <span class="pt-2">Undo</span>
    </button>

    <button
      :class="[
        'btn btn-success sm:btn-wide gap-3 sm:ml-auto sm:flex-grow-0',
        loading && 'loading',
      ]"
      :disabled="disabled"
      @click="submitDrawing"
    >
      <font-awesome-icon icon="fa-floppy-disk" class="fa-2xl" />
      <span class="pt-2">Save</span>
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
      return ["", "fa-xl", "fa-2xl"][size];
    },

    selectBrush(ind) {
      this.selectedBrush = ind;
      this.$emit("brushSize", this.brushSizes[this.selectedBrush])
    },

    undoDrawing() {
      this.$emit("undo")
    },

    submitDrawing() {
      this.$emit("submit")
    },

  },
};
</script>
