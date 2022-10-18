<template>
  <div class="flex flex-col items-center pb-6">
    <h1
      class="font-medium leading-tight text-4xl border-2 border-cyan-300 p-3 m-3 text-center rounded-2xl"
    >
      {{ topic.category }}: {{ topic.subject }}
    </h1>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  mounted() {
    // get topic
    this.$socket.emit("game:get_topic");
  },
  computed: {
    ...mapState({
      playerId: (state) => state.lobby.playerId,
      topic: (state) => state.game.topic,
    }),
  },
};
</script>
