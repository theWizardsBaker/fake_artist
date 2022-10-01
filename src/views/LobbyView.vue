<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content">
      <div class="flex flex-col">
        <div class="p-4 text-center">
          <label class="">Game Code</label>
          <h3 class="font-medium text-6xl my-3">{{ $route.params.gameId }}</h3>
        </div>
        <player-create v-if="!created" @createdPlayer="created = true" />
        <player-list v-else />
      </div>
    </div>
  </div>
</template>

<script>
import PlayerCreate from "@/components/PlayerCreate.vue";
import PlayerList from "@/components/PlayerList.vue";
export default {
  components: {
    PlayerCreate,
    PlayerList,
  },
  data() {
    return {
      created: false,
    };
  },
};
</script>
