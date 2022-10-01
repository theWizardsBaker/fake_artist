<template>
  <div class="flex items-center space-x-3 py-1">
    <div>
      <h3 class="font-bold">{{ id }}</h3>
    </div>
    <div class="avatar">
      <div
        class="mask mask-squircle w-6 h-6"
        :style="{ 'background-color': color }"
      ></div>
    </div>
    <div>
      <div class="font-bold">{{ name }}</div>
    </div>
    <div v-if="selectable">
      <input type="checkbox" />
    </div>
    <div v-if="showReady">
      <h3 v-show="isReady">READY</h3>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: Number,
    name: String,
    color: String,
    selectable: Boolean,
    selected: Boolean,
    showTurn: Boolean,
    isTurn: Boolean,
    showReady: Boolean,
    isReady: Boolean,
  },
};
</script>
