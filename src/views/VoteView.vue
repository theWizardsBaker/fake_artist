<template>
  <div class="min-h-screen bg-base-200">
    <!-- show players the topic -->
    <div class="flex justify-center pt-5">
      <h3 class="text-5xl font-bold">Vote</h3>
    </div>
    <div class="flex justify-center">
      <div class="flex flex-col items-start">
        <div
          class="flex-auto mb-10 mt-5"
          ref="canvas"
          :style="{ width: `${canvasSize}px`, height: `${canvasSize}px` }"
        >
          <drawing-canvas :enableDrawing="false" :canvasSize="canvasSize" />
        </div>
        <div
          class="flex-initial place-self-center lg:place-self-start lg:pt-5 text-center"
          :class="[`w-[${canvasSize}px]`]"
        >
          <player-list
            @selected="setSelection"
            :selection="selection"
            :showSelect="!voted"
            :directions="playerDirection"
          />
          <game-exit-button v-if="revealHiddenArtist" />
          <button
            v-else="revealHiddenArtist"
            class="btn btn-wide mx-6 m-4"
            :disabled="!selection || voted"
            @click="vote"
          >
            Vote
          </button>
        </div>
      </div>
    </div>
  </div>

  <!--   <main>
    <base-page>
      <div class="max-w-md">
        <div class="flex flex-col gap-5">
          <card>
            <div class="flex flex-col gap-5">
              <div
                v-if="revealHiddenArtist && hiddenArtist"
                class="text-center border-2 p-2 rounded-md"
              >
                <div>
                  <label class="font-bold text-xl">Fake Artist</label>
                  <font-awesome-icon icon="fa-paintbrush" />
                </div>
                <div class="text-2xl">{{ hiddenArtist.name }}</div>
              </div>
              <div v-else class="p-2 text-center">Select the fake artist</div>
              <player-list
                @selected="setSelection"
                :selection="selection"
                :showSelect="!voted"
              />
              <div class="text-center">
                <game-exit-button v-if="revealHiddenArtist" />
                <button
                  v-else
                  class="btn btn-wide mx-6"
                  :disabled="!selection || voted"
                  @click="vote"
                >
                  Vote
                </button>
              </div>
            </div>
          </card>
        </div>
      </div>
    </base-page>
  </main> -->
</template>

<script>
import PlayerList from "@/components/PlayerList.vue";
import GameExitButton from "@/components/GameExitButton.vue";
import BasePage from "@/components/ui/BasePage.vue";
import Card from "@/components/ui/Card.vue";
import DrawingCanvas from "@/components/DrawingCanvas.vue";
import { mapGetters, mapState } from "vuex";

export default {
  name: "VotePage",

  components: {
    DrawingCanvas,
    PlayerList,
    BasePage,
    Card,
    GameExitButton,
  },

  mounted() {
    this.$socket.emit("game:voted", this.player._id);
    window.addEventListener("visibilitychange", this.checkVotes);
  },

  unmounted() {
    window.removeEventListener("visibilitychange", this.checkVotes);
  },

  computed: {
    ...mapGetters({
      player: "lobby/player",
      hiddenArtist: "lobby/hiddenArtist",
    }),
  },

  data() {
    return {
      selection: null,
      voted: false,
      revealHiddenArtist: false,
      playerDirection: "Select the fake artist",
      canvasSize: "300",
    };
  },

  sockets: {
    "success:voted"(playerId) {
      this.selection = playerId;
      this.$socket.emit("game:voting");
    },

    "error:voted"(playerId) {
      this.selection = null;
      this.voted = false;
    },

    "success:voting_complete"() {
      this.revealHiddenArtist = true;
    },
  },

  methods: {
    setSelection(player) {
      this.selection = player;
    },

    vote() {
      this.voted = true;
      this.$socket.emit("game:vote", this.player._id, this.selection);
    },

    async checkVotes() {
      await this.$nextTick();
      // only look if the window is visible
      if (document.visibilityState === "visible") {
        this.$socket.emit("game:get_votes", this.player._id);
      }
    },
  },
};
</script>
