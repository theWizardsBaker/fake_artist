<template>
  <div>
    <h3 class="text-lg">{{ $route.params.gameId }}</h3>

    <player-create v-if="!created"/>
    <player-list v-else/>
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
      created: false
    };
  },
};
</script>
