<template>
  <button
    :class="['btn btn-block text-lg', loading && 'loading']"
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
  },
};
</script>
