<template>
  <div class="pt-5">
    <h3 class="text-center font-bold">Players</h3>
    <ul class="bg-secondary rounded-lg text-gray-900 m-2 my-4">
      <li
        class="px-6 py-2 w-full rounded-t-lg border-b border-gray-600 last:border-b-0"
        v-for="(player, playerInd) in players"
      >
        <player-card
          v-bind="player"
          :order="playerInd"
          :key="player._id"
          :showTurn="showTurn"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/stores";
import PlayerCard from "@/components/PlayerCard.vue";

export default {
  props: {
    showTurn: {
      type: Boolean,
      default: false,
    },

    showSelect: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    PlayerCard,
  },

  computed: {
    ...mapGetters({
      players: "lobby/orderedPlayers",
    }),
  },

  data() {
    return {};
  },
};
</script>
