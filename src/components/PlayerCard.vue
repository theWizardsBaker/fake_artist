<template>
  <a
    :class="['flex items-center space-x-3', selected && 'active']"
    @click.default="select"
  >
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
      <button class="btn btn-xs btn-primary gap-2" v-show="isTurn">
        Artist
        <font-awesome-icon icon="fa-paintbrush" />
      </button>
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
    showTurn: {
      type: Boolean,
      default: false,
    },
    isReady: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState({
      playerTurn: (state) => state.game.playerTurn,
    }),

    isTurn() {
      return this.order === this.playerTurn;
    },

    select() {
      this.$emit("selected");
    },
  },
};
</script>
