<template>
  <div class="card sm:w-96">
    <div class="card-body">
      <div class="form-control mb-3">
        <label class="input-group">
          <span>Color</span>
          <v-swatches v-model="color" />
        </label>
      </div>
      <div class="form-control mb-3">
        <label class="input-group input-group">
          <span>Name</span>
          <input type="text" v-model="name" placeholder="Type here" class="input input-bordered" />
        </label>
      </div>
      <div class="form-control mb-3">
        <game-entry-button :disabled="!color || (!name || name.length <= 2)">
          Join Game
        </game-entry-button>
      </div>
    </div>
  </div>
</template>

<script>
import VSwatches from 'vue3-swatches'
import GameEntryButton from '@/components/GameEntryButton.vue'

export default {
  components: { 
    VSwatches,
    GameEntryButton
  },
  data() {
    return {
      color: null,
      name: null
    }
  },
};
</script>
