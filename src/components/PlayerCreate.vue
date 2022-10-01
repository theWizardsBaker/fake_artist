<template>
  <div class="card sm:w-96 bg-base-100 shadow-xl">
    <div class="card-body">
      <div class="form-control mb-3">
        <label class="input-group">
          <span>Brush Color</span>
          <v-swatches
            id="swatch"
            v-model="color"
            swatch-size="54"
            background-color="darkGray"
            show-border
            inline
          />
        </label>
      </div>
      <div class="form-control mb-3">
        <label class="input-group input-group">
          <span>Name</span>
          <input
            type="text"
            v-model="name"
            placeholder="Type here"
            class="input input-bordered"
          />
        </label>
      </div>
      <div class="form-control mb-3">
        <game-entry-button
          class="btn-outline btn-info"
          :disabled="!formFilled"
          @click="createPlayer"
        >
          Join Game
        </game-entry-button>
      </div>
    </div>
  </div>
</template>

<script>
import VSwatches from "vue3-swatches";
import GameEntryButton from "@/components/GameEntryButton.vue";

export default {
  components: {
    VSwatches,
    GameEntryButton,
  },

  computed: {
    formFilled() {
      return this.color !== null && this.name !== null && this.name.length >= 2;
    },
  },

  methods: {
    createPlayer() {
      if (this.formFilled) {
        this.$emit("createdPlayer", JSON.stringify(this));
      }
    },
  },

  data() {
    return {
      color: null,
      name: null,
    };
  },
};
</script>

<style scoped>
body {
  background-color: black;
}
:deep(.vue-swatches__wrapper) {
  padding: 10px;
}
</style>
