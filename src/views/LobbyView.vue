<template>
  <div>
    <h3 class="text-lg">{{ $route.params.gameId }}</h3>
    <player-create />
    <player-list />
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
    };
  },
};
</script>
