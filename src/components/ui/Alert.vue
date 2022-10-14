<template>
  <div :class="['alert shadow-lg', 'alert-' + alertLevel]">
      <div>
        <template v-for="alert in Object.keys(alertTypes)">
          <font-awesome-icon
            v-if="alertLevel === alert"
            :icon="alertTypes[alert]"
            class="fa-xl mr-2" 
          />
        </template>
        <slot name="content" tag="span"></slot>
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
        return ["info", "success", "warning", "error"].includes(value)
      },
    },
  },
  data(){
    return {
      alertTypes: {
        info: 'fa-circle-info',
        success: 'fa-circle-check',
        warning: 'fa-triangle-exclaimation',
        error: 'fa-circle-xmark'
      },
    }
  }
};
</script>
