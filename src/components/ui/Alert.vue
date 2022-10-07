<template>
  <div :class="['alert shadow-lg', 'alert-' + alertLevel]">
    <div>
      <div>
        <slot name="content"></slot>
      </div>
    </div>
    <div class="flex-none">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    alertLevel: {
      type: String,
      default: "info",
      validator(value) {
        return ["info", "success", "warning", "error"].includes(value);
      },
    },
  },
};
</script>
