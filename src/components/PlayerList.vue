<template>
  <div class="pt-5">
    <h3 class="text-center font-bold">Players</h3>
    <ul class="bg-secondary rounded-lg text-gray-900 m-4">
      <li
        class="px-6 py-2 w-full rounded-t-lg border-b border-gray-600 last:border-b-0"
        v-for="player in players"
      >
        <player-card v-bind="player" :key="player.id" showReady />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PlayerCard from "@/components/PlayerCard.vue";
import lobbyStore from "@/stores/lobby.js";

export default {
  props: {
    showReady: {
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
    ...mapState({
      players: state => state.lobby.players,
    }),
  },

  data() {
    return {};
  },
};
</script>
