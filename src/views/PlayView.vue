<template>
  <div class="min-h-screen bg-base-200">
    <div class="flex justify-center pt-10">
      <div>
        <h3 class="font-medium leading-tight text-2xl text-center">Drawing</h3>
        <h1
          class="font-medium leading-tight text-4xl border-2 border-cyan-300 p-3 m-3 text-center rounded-2xl"
        >
          Animal: Dog
        </h1>
      </div>
    </div>
    <div class="flex justify-center">
      <div class="flex flex-col lg:flex-row">
        <div class="flex-initial hidden xl:block">
          <player-list />
        </div>
        <div
          class="flex-auto"
          v-show="selectedDisplay === 0"
          ref="canvas"
          :style="{ width: width, height: width }"
        >
          <drawing-canvas :canvasSize="canvasSize" />
        </div>
        <div class="flex-auto" v-show="selectedDisplay === 1">
          <player-list />
        </div>
      </div>
      <div class="btm-nav btm-nav-sm sm:hidden">
        <button
          v-for="(display, displayInd) in displays"
          :class="[selectedDisplay === displayInd && 'active']"
          @click="selectedDisplay = displayInd"
        >
          <span class="btm-nav-label">
            <font-awesome-icon :icon="display" class="fa-2xl" />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PlayerList from "@/components/PlayerList.vue";
import DrawingCanvas from "@/components/DrawingCanvas.vue";

export default {
  components: {
    PlayerList,
    DrawingCanvas,
  },

  mounted() {
    window.addEventListener("resize", this.getWindowDimensions);
    this.$nextTick(() => {
      this.getCanvasDimensions();
    });
  },

  unmounted() {
    window.removeEventListener("resize", this.getWindowDimensions);
  },

  watch: {
    width(newDisplay, oldDisplay) {
      this.selectedDisplay = 0;
      this.getCanvasDimensions();
    },
  },

  data() {
    return {
      selectedDisplay: 0,
      displays: ["fa-paintbrush", "fa-users"],
      width: document.documentElement.clientWidth,
      canvasSize: "400",
    };
  },

  methods: {
    getWindowDimensions() {
      this.width = document.documentElement.clientWidth;
    },

    getCanvasDimensions() {
      const containerWidthStr = window.getComputedStyle(
        this.$refs.canvas
      ).width;
      const digitRegex = /\d+/;
      this.canvasSize = digitRegex.exec(containerWidthStr)[0];
    },
  },
};
</script>
