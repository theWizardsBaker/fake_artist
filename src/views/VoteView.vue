<template>
  <div class="min-h-screen bg-base-200 pt-10">
    <modal :show="showDirections">
      <template v-slot:title> Time to vote! </template>
      <template v-slot:body>
        <b>All players</b> vote on who they think the fake artist is.
        <br />
        The fake artist wins if they don't receive the <b>majority</b> vote.
        <br />
        <br />
        If the fake artist is caught, they get one chance to
        <b>guess the topic</b> that was drawn. If they guess correctly, they
        win!
      </template>
      <template v-slot:action>
        <label class="btn btn-info" @click="showDirections = false">
          Okay!
        </label>
      </template>
    </modal>
    <!-- show players the topic -->
    <h3 class="text-5xl font-bold text-center">Vote</h3>
    <div class="flex justify-center">
      <div class="flex flex-col items-start">
        <div
          class="flex-auto mt-5 place-self-center"
          ref="canvas"
          :style="{ width: `${canvasSize}px`, height: `${canvasSize}px` }"
        >
          <drawing-canvas
            :enableDrawing="false"
            :canvasSize="`${canvasSize}`"
          />
        </div>
        <div class="text-center border-2 p-2 rounded-md place-self-center">
          <div>
            <label class="font-bold text-xl mr-2">Fake Artist</label>
            <font-awesome-icon icon="fa-paintbrush" />
          </div>
          <h1
            class="font-medium leading-tight text-4xl border-2 border-primary-content p-3 m-3 text-center text-primary-content rounded-2xl"
          >
            <div class="text-2xl">
              {{
                revealHiddenArtist && hiddenArtist ? hiddenArtist.name : "???"
              }}
            </div>
          </h1>
        </div>
        <card class="place-self-center w-full mb-5">
          <div class="flex-initial place-self-center text-center w-full">
            <player-list
              @selected="setSelection"
              :selection="selection"
              :showSelect="!voted"
              :directions="voted ? '' : playerDirection"
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
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from "@/components/ui/Modal.vue";
import PlayerList from "@/components/PlayerList.vue";
import GameExitButton from "@/components/GameExitButton.vue";
import BasePage from "@/components/ui/BasePage.vue";
import Card from "@/components/ui/Card.vue";
import DrawingCanvas from "@/components/DrawingCanvas.vue";
import { mapGetters, mapState } from "vuex";

export default {
  name: "VotePage",

  components: {
    Modal,
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
      showDirections: true,
      selection: null,
      voted: false,
      revealHiddenArtist: false,
      playerDirection: "Select the fake artist and click vote",
      canvasSize: "400",
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
