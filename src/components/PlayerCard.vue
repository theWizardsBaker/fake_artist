<template>
  <div class="flex items-center space-x-3 py-1">
    <div class="avatar">
      <div class="mask mask-squircle w-6 h-6 bg-slate-50">
        <font-awesome-icon icon="fa-user" />
      </div>
    </div>
    <div>
      <div class="font-bold">{{ name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    color: String,
    selectable: Boolean,
    selected: Boolean,
    showTurn: Boolean,
    isTurn: Boolean,
  },
};
</script>
