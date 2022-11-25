<template>
  <div
    :class="['modal modal-middle', show && 'modal-open']"
    @click="backgroundClick"
  >
    <div class="modal-box">
      <label
        class="btn btn-sm btn-circle absolute right-2 top-2"
        v-if="showClose"
        @click="backgroundClick"
      >
        ✕
      </label>
      <h3 class="font-bold text-xl">
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
    showClose: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    backgroundClick() {
      this.$emit("backgroundClick");
    },
  },
};
</script>
