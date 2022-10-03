<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content">
      <div class="flex">
        <div class="flex-auto">
          <player-list />
        </div>
        <div class="flex-auto">
        	Category: Animals
          <drawing-canvas />
        </div>
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
  data() {
    return {};
  },
};
</script>
