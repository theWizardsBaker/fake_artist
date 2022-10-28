<template>
  <div class="flex flex-col items-center pb-6">
    <h1
      class="font-medium leading-tight text-4xl border-2 border-primary-content p-3 m-3 text-center text-primary-content rounded-2xl"
    >
      {{ topic }}
    </h1>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  mounted() {
    // get topic if we don't already have one
    if (!this.topic) {
      this.$socket.emit("game:get_topic", this.playerId);
    }
  },
  computed: {
    ...mapState({
      playerId: (state) => state.lobby.playerId,
      topic: (state) => state.game.topic,
    }),
  },
};
</script>
