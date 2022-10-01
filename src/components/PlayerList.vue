<template>
  <ul class="bg-secondary rounded-lg text-gray-900 m-4">
    <li class="px-6 py-2 w-full rounded-t-lg" v-for="player in players">
      <player-card v-bind="player" :key="player.id" showReady />
    </li>
  </ul>
</template>

<script>
import { mapState } from "pinia";
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
    ...mapState(lobbyStore, ["players"]),
  },

  data() {
    return {};
  },
};
</script>
