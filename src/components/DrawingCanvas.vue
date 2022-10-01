<template>
  <div>
    <div class="flex flex-col">
      <vue-drawing-canvas ref="VueCanvasDrawing" lock="lockCanvas" />
      <div>
        <div class="btn-group">
          <button class="btn btn-active">Button</button>
          <button class="btn">Button</button>
          <button class="btn">Button</button>
        </div>
      </div>
      <div>
        <button>Erase Current Drawing</button>
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

  props: {
    lockCanvas: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {};
  },
};
</script>
