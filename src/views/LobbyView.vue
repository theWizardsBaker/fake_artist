<template>
  <div class="flex justify-center bg-base-200">
    <div class="flex flex-col">
      <div class="p-4 text-center">
        <label>Game Code</label>
        <h3 class="font-medium text-6xl my-3 border-2 p-3 rounded-2xl">
          {{ $route.params.gameId }}
        </h3>
      </div>
      <div class="flex flex-col mt-5 grow">
        <button
          :class="[
            'btn text-center mx-5',
            ready ? 'btn-success btn-outline' : 'btn-info',
          ]"
          @click="playerReady()"
        >
          {{ ready ? "Ready" : "Click when ready" }}
        </button>
        <player-list showReady />
      </div>
    </div>
  </div>
</template>

<script>
import PlayerList from "@/components/PlayerList.vue";

export default {
  components: {
    PlayerList,
  },

  data() {
    return {
    };
  },

  methods: {
    playerReady() {
      if (this.ready) return;
      this.ready = true;

    },
  },
};
</script>
