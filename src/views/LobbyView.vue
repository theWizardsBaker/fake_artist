<template>
  <main>
    <div class="sm:relative m-2">
      <button
        class="
          btn
          btn-square
          btn-info
          btn-outline
          text-center
          rounded-2xl
          m-5
          gap-2
          sm:absolute
          sm:right-0
          float-right
        "
        @click="exitGame()"
      >
        <font-awesome-icon icon="fa-x" />
      </button>
    </div>
    <base-page>
      <div class="max-w-md">
        <div class="flex flex-col">
          <div class="p-4 text-center">
            <label>Game Code</label>
            <h3 class="font-medium text-6xl my-3 border-2 p-3 rounded-2xl">
              {{ $route.params.gameId }}
            </h3>
          </div>
          <button
            v-if="isLeader"
            :class="[
              'btn btn-success text-center mx-5 my-3 gap-2',
              players.length > 3 && 'animate-pulse'
            ]"
            :disabled="players.length < 3"
            @click="startGame()"
          >
            <span>Start Game</span>
            <font-awesome-icon icon="fa-right-from-bracket" />
          </button>
          <card>
            <div class="form-control mb-3">
              <label class="input-group">
                <span>Brush Color</span>
                <v-swatches
                  id="swatch"
                  v-model="color"
                  :swatches="swatches"
                  swatch-size="54"
                  background-color="darkGray"
                  show-border
                  inline
                />
              </label>
            </div>
            <player-list showReady />
          </card>
        </div>
      </div>
    </base-page>
  </main>
</template>

<script>
import Card from "@/components/ui/Card.vue";
import BasePage from "@/components/ui/BasePage.vue";
import PlayerList from "@/components/PlayerList.vue";
import VSwatches from "vue3-swatches";
import { mapGetters, mapState } from "vuex";
import store from "@/stores";

export default {
  name: "GameLobby",

  // beforeRouteLeave (to, from , next) {
  //   // const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  //   // if (answer) {
  //   //   next()
  //   // } else {
  //   //   next(false)
  //   // }
  //   alert("EAVING")
  // },

  beforeUnmount() {
    alert("UNMOUNTED")
  },

  components: {
    PlayerList,
    VSwatches,
    BasePage,
    Card,
  },

  computed: {
    ...mapState({
      players: (state) => state.lobby.players
    }),
    ...mapGetters({
      swatches: "lobby/colorSwatches",
      isLeader: "lobby/isLeader"
    }),
  },

  watch: {
    color(newColor, oldColor) {
      console.log(newColor, oldColor, this.color)
      // if the color is not disabled
      if(this.swatches.find((s) => (s.color === newColor) && s.disabled)) {
        this.color = oldColor;
      } else {
        this.$socket.emit("colors:update", newColor);
      }
    },
  },

  data() {
    return {
      color: "",
      ready: false,
    };
  },

  sockets: {
    "error:colors_updated"(colors) {
      this.color = "";
    },
  },

  methods: {
    startGame() {
      if (this.players.length > 3){
        this.$socket.emit("game:start")        
      }
    },

    exitGame() {
      this.$socket.emit("lobby:quit");
    },
  },
};
</script>

<style>
div.vue-swatches__swatch--is-disabled {
  opacity: 20% !important;
}

div.vue-swatches__swatch {
  margin: 8px !important;
}
</style>
