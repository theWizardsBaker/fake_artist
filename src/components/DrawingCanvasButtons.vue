<template>
  <div class="flex flex-col justify-center gap-5 flex-wrap">
    <div class="flex justify-center flex-wrap gap-5">
      <div class="form-control">
        <label class="label justify-center">
          <span class="label-text">Brush Size</span>
        </label>
        <div class="btn-group rounded-2xl">
          <div
            v-for="(brush, brushInd) in brushSizes"
            :class="[
              'btn btn-sm sm:btn-md',
              selectedBrush === brushInd && 'btn-active',
            ]"
            @click="selectBrush(brushInd)"
          >
            <font-awesome-icon
              icon="fa-circle"
              :class="brushIconSize(brushInd)"
            />
          </div>
        </div>
      </div>
      <div class="form-control">
        <label class="label justify-center">
          <span class="label-text">Touch Offset</span>
        </label>
        <div class="btn-group rounded-2xl">
          <div
            v-for="(offset, offsetInd) in offsetPositions"
            :class="[
              'btn btn-sm sm:btn-md',
              selectedOffset === offsetInd && 'btn-active',
            ]"
            @click="selectOffset(offsetInd)"
          >
            <font-awesome-icon icon="fa-circle" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center flex-wrap gap-5 mx-[30px] md:mx-[110px]">
      <button
        class="btn gap-3 btn-sm sm:btn-md"
        @click.prevent="undoDrawing()"
        :disabled="disabled"
      >
        <font-awesome-icon icon="fa-eraser" class="fa-xl text-lg sm:text-3xl" />
        <span>Undo</span>
      </button>

      <button
        class="btn btn-success btn-sm sm:btn-md w-40 md:btn-wide gap-3"
        :class="[loading && 'loading']"
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
      selectedOffset: 1,
      offsetPositions: ["left", "none", "right"],
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

    selectOffset(ind) {
      this.selectedOffset = ind;
      this.$emit("offsetPosition", this.offsetPositions[this.selectedOffset]);
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
