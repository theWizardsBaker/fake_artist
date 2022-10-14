<template>
  <section class="p-3">
    <!-- swatch selector -->
    <div class="form-control mb-3">
      <label class="input-group">
        <span>Brush Color</span>
        <v-swatches
          id="swatch"
          v-model="color"
          :swatches="swatches"
          swatch-size="54"
          background-color="darkGray"
          show-border
          inline
        />
      </label>
    </div>
    <!-- name input -->
    <div class="form-control mb-3">
      <label class="input-group input-group">
        <span>Name</span>
        <input
          type="text"
          v-model="name"
          placeholder="Type here"
          class="input input-bordered w-[100%]"
          maxlength="25"
        />
      </label>
    </div>
    <!-- join game button -->
    <div class="form-control mb-3">
      <game-entry-button
        class="btn-outline btn-info"
        :disabled="!formFilled"
        @click="createPlayer"
      >
        Join Game
      </game-entry-button>
    </div>
  </section>
</template>

<script>
import VSwatches from "vue3-swatches";
import GameEntryButton from "@/components/GameEntryButton.vue";
import { mapState } from "vuex";
import store from "@/stores";

export default {
  components: {
    VSwatches,
    GameEntryButton,
  },

  created() {
    this.$socket.emit("colors:get")
  },

  computed: {
    formFilled() {
      return this.color !== null && this.name !== null && this.name.length >= 2;
    },
    ...mapState({
      swatches: (state) => state.color.swatches,
    }),
  },

  data() {
    return {
      color: null,
      name: null,
    };
  },

  sockets: {

    "success:created_player"(gameId) {
      this.$emit("success", gameId);
    },

    "error:created_player"(errorMsg) {
      this.gameId = "";
      this.loading = false;
      this.$emit("error", `Game not found: ${errorMsg}`);
    },

  },

  methods: {
    createPlayer() {
      if (this.formFilled) {
        this.$emit("createdPlayer", JSON.stringify(this));
      }
    },
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
