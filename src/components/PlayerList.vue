<template>
  <div>
    <h3 class="text-center font-bold py-3 text-xl">Players</h3>
    <p class="p-3 pt-0">{{ directions }}</p>
    <ul class="menu p-2 rounded-box bg-secondary text-secondary-content">
      <li v-for="(player, playerInd) in players">
        <player-card
          v-bind="player"
          :order="playerInd"
          :key="player._id"
          :showTurn="showTurn"
          :isSelectable="showSelect"
          :selected="showSelect && player._id === selected"
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

    selection: {
      type: String,
    },

    directions: {
      type: String,
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

  watch: {
    selection(selectionValue) {
      this.selected = selectionValue;
    },
  },

  data() {
    return {
      selected: null,
    };
  },

  methods: {
    playerSelected(player) {
      if (this.showSelect) {
        this.selected = this.selected === player ? null : player;
        this.$emit("selected", this.selected);
      }
    },
  },
};
</script>
