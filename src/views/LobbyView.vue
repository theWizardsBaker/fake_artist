<template>
  <main>
    <base-page>
          <div class="max-w-md">
            <div class="flex flex-col">
              <div class="p-4 text-center">
                <label>Game Code</label>
                <h3 class="font-medium text-6xl my-3 border-2 p-3 rounded-2xl">
                  {{ $route.params.gameId }}
                </h3>
              </div>
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
                <div class="flex flex-col mt-5 grow">
                  <div class="flex">
                    <button
                      :class="[
                        'btn text-center mx-5 gap-2',
                        ready ? 'btn-success' : 'btn-info btn-outline',
                      ]"
                      @click="playerReady()"
                    >
                      <span>Ready to play</span>
                      <font-awesome-icon v-if="ready" icon="fa-circle-check" />
                      <font-awesome-icon v-else icon="fa-circle" />
                    </button>
                    <button
                      class="btn text-center mx-5 btn-info btn-outline gap-2"
                      @click="exitGame()"
                    >
                      Exit Game
                      <font-awesome-icon icon="fa-right-from-bracket" />
                    </button>
                  </div>
                  <player-list showReady />
                </div>
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
import { mapState } from "vuex";
import store from "@/stores";

export default {

  name: "GameLobby",

  components: {
    PlayerList,
    VSwatches,
    BasePage,
    Card,
  },

  computed: {
    ...mapState({
      swatches: (state) => state.lobby.swatches,
    }),
  },

  data() {
    return {
      color: "",
      ready: false
    };
  },

  methods: {
    
    playerReady() {
      if (this.ready) return;
      this.ready = true;
    },

    exitGame() {
      this.$store.dispatch("lobby/updateGameId", null)
    }

  },
};
</script>

<style>
  div.vue-swatches__swatch {
    margin:  8px !important;
  }
</style>
