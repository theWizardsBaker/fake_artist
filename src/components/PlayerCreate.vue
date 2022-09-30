<template>
  <div>
     <v-swatches v-model="color" popover-x="left"></v-swatches>
    <div class="form-control">
      <label class="input-group input-group-md">
        <span>Name</span>
        <input type="text" placeholder="Type here" class="input input-bordered input-md" />
      </label>
    </div>
  </div>
</template>

<script>
import VSwatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.css'

export default {
  components: { VSwatches },
  data() {
    return {
      color: '#1CA085',
    }
  },
};
</script>
