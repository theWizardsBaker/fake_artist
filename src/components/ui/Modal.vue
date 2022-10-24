<template>
  <div :class="['modal modal-middle', show && 'modal-open']">
    <div class="modal-box">
      <h3 class="font-bold text-lg">
        <slot name="title"></slot>
      </h3>
      <p class="py-4">
        <slot name="body"></slot>
      </p>
      <div class="modal-action">
        <slot name="action"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
