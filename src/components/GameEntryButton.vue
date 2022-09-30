<template>
  <button
    :class="['btn btn-block text-lg', loading && 'loading', classes]"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    disabled: Boolean,
    classes: [String],
  },
};
</script>
