<template>
  <div class="pt-5">
    <h3 class="text-center font-bold">Players</h3>
    <ul class="menu bg-base-100 p-2 rounded-box bg-secondary">
      <li v-for="(player, playerInd) in players">
        <player-card
          v-bind="player"
          :order="playerInd"
          :key="player._id"
          :showTurn="showTurn"
          :isSelectable="showSelect"
          :selected="player._id === selected"
          @selected="playerSelected(player._id)"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
    return {
      selected: null,
    };
  },

  methods: {
    playerSelected(player) {
      if (this.showSelect) {
        this.selected = player;
        this.$emit("selected", this.selected);
      }
    },
  },
};
</script>
