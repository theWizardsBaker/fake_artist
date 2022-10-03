<template>
  <div class="flex justify-center min-h-screen bg-base-200">
    <div class="flex flex-auto flex-col lg:flex-row">
      <div class="flex-initial hidden lg:block">
        <player-list />
      </div>
      <div class="flex-auto">
        Category: Animals
        <drawing-canvas />
      </div>
      <div class="flex-auto lg:hidden">
        <player-list />
      </div>
    </div>
    <div class="btm-nav btm-nav-sm md:hidden">
      <button class="active">
        <span class="btm-nav-label">Canvas</span>
      </button>
      <button>
        <span class="btm-nav-label">Players</span>
      </button>
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
  data() {
    return {};
  },
};
</script>
