<template>
  <ul
    class="
      bg-secondary
      rounded-lg
      sm:w-72
      text-gray-900
      m-4"
  >
    <li
      class="
        px-6
        py-2
        w-full
        rounded-t-lg
      " 
      v-for="(player, playerInd) in players"
    >
      <player-card
        v-bind="player"
        :key="playerInd"
      />
    </li>
  </ul>
</template>

<script>
import PlayerCard from "@/components/PlayerCard.vue";
export default {
  components: {
    PlayerCard,
  },
  data() {
    return {
    };
  },
};
</script>
