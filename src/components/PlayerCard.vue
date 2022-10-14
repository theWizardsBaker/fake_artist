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
    <div class="flex-auto text-right" v-if="showReady">
      <div class="badge badge-success rounded-md" v-show="isReady">Ready</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: Number,
    name: String,
    color: String,
    selectable: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    showTurn: {
      type: Boolean,
      default: false
    },
    isTurn: {
      type: Boolean,
      default: false
    },
    showReady: {
      type: Boolean,
      default: false
    },
    isReady: {
      type: Boolean,
      default: false
    },
  },
};
</script>
