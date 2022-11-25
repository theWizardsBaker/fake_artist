<template>
  <a :class="['w-full block', selected && 'active']" @click.default="select">
    <div class="flex items-center space-x-3">
      <div>
        <h3 class="font-bold">{{ order + 1 }}</h3>
      </div>
      <div class="avatar">
        <div
          class="mask mask-squircle w-6 h-6"
          :style="{ 'background-color': color || 'white' }"
        ></div>
      </div>
      <div>
        <div class="font-bold">{{ name }}</div>
      </div>
      <div class="flex-auto text-right" v-if="showTurn">
        <button class="btn btn-xs btn-accent gap-2" v-show="isTurn">
          Artist
          <font-awesome-icon icon="fa-paintbrush" />
        </button>
      </div>
    </div>
    <div v-if="votes.length > 0" class="m-3 pt-3 border-t">
      <div class="font-mono uppercase text-center text-xs">
        <font-awesome-icon icon="fa-check-to-slot" />
        Votes
      </div>
      <div v-for="vote in votes" class="pt-2">
        {{ getPlayerName(vote) }}
      </div>
    </div>
  </a>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  props: {
    order: Number,
    name: String,
    color: String,
    isSelectable: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    showTurn: {
      type: Boolean,
      default: false,
    },
    isReady: {
      type: Boolean,
      default: false,
    },
    votes: {
      type: Array,
      default: [],
    },
  },

  computed: {
    ...mapState({
      players: (state) => state.lobby.players,
      playerTurn: (state) => state.game.playerTurn,
    }),

    isTurn() {
      return this.order === this.playerTurn;
    },
  },

  methods: {
    getPlayerName(playerId) {
      return this.players.find((p) => p._id === playerId).name;
    },

    select() {
      this.$emit("selected");
    },
  },
};
</script>
