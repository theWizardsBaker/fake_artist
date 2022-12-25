<template>
  <base-page>
    <modal :show="showDirections">
      <template v-slot:title>Time to vote!</template>
      <template v-slot:body>
        <b>Vote</b> for who you think the fake artist is.
        <br />
        <br />
        The fake artist wins if they don't receive the <b>majority</b> vote,
        however, if the fake artist is caught, they get <i>one</i> chance to
        <b>guess the topic</b>. If they guess correctly, they <i>win</i>!
      </template>
      <template v-slot:action>
        <label class="btn btn-info" @click="showDirections = false">
          Okay!
        </label>
      </template>
    </modal>
    <div class="flex justify-center content-center">
      <div class="flex flex-col md:flex-row items-start gap-5">
        <div class="md:hidden mb-5 place-self-center">
          <div
            class="flex-auto mt-5"
            ref="canvas"
          >
            <drawing-canvas
              :enableDrawing="false"
              :canvasSize="canvasSize"
              lockCanvas
              v-if="canvasSize < 400"
            />
          </div>
          <div class="text-center p-2 rounded-md place-self-center">
            <div>
              <label class="font-bold text-xl mr-2">Fake Artist Identity</label>
              <font-awesome-icon icon="fa-paintbrush" />
            </div>
            <h1
              class="font-medium leading-tight text-4xl border-2 border-base-content p-3 m-3 text-center text-base-content rounded-2xl"
            >
              <div class="text-2xl">
                {{
                  revealHiddenArtist && hiddenArtist ? hiddenArtist.name : "???"
                }}
              </div>
            </h1>
          </div>
        </div>
        <card class="place-self-center w-full mb-5 md:flex-none">
          <div class="flex-initial place-self-center text-center w-full">
            <player-list
              @selected="setSelection"
              :selection="selection"
              :showSelect="!voted"
              :directions="voted ? '' : playerDirection"
            />
            <div v-if="revealHiddenArtist">
              <button
                class="btn btn-info btn-block text-lg mt-5 mx-0 rounded-2xl mt-8 mb-5 gap-2"
                @click="exitGame()"
              >
                Quit
                <font-awesome-icon icon="fa-right-from-bracket" />
              </button>
              <game-entry-button
                @click="playAgain"
                :loading="loading"
                class="rounded-2xl btn-success gap-2"
              >
                Play Again
                <font-awesome-icon icon="fa-play" />
              </game-entry-button>
            </div>
            <button
              v-else
              class="btn btn-wide mx-6 m-4"
              :disabled="!selection || voted"
              @click="vote"
            >
              Vote
            </button>
          </div>
        </card>
        <div class="hidden md:block mb-5 md:flex-auto">
          <div class="text-center p-2 rounded-md place-self-center">
            <div>
              <label class="font-bold text-xl mr-2">Fake Artist Identity</label>
              <font-awesome-icon icon="fa-paintbrush" />
            </div>
            <h1
              class="font-medium leading-tight text-4xl border-2 border-base-content p-3 m-3 text-center text-base-content rounded-2xl"
            >
              <div class="text-2xl">
                {{
                  revealHiddenArtist && hiddenArtist ? hiddenArtist.name : "???"
                }}
              </div>
            </h1>
          </div>
          <div
            class=" mt-5 place-self-center"
            ref="canvas"
          >
            <drawing-canvas
              :enableDrawing="false"
              :canvasSize="canvasSize"
              lockCanvas
              v-if="canvasSize === 400"
            />
          </div>
        </div>
      </div>
    </div>
  </base-page>
</template>

<script>
import Modal from "@/components/ui/Modal.vue";
import PlayerList from "@/components/PlayerList.vue";
import GameEntryButton from "@/components/GameEntryButton.vue";
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
    GameEntryButton,
  },

  mounted() {
    this.$socket.emit("game:voted", this.player._id);
    if(this.isLeader){
      this.$socket.emit("lobby:next", this.code);
    }
    window.addEventListener("visibilitychange", this.checkVotes);
    window.addEventListener("resize", this.getWindowDimensions);
  },

  unmounted() {
    window.removeEventListener("visibilitychange", this.checkVotes);
    window.removeEventListener("resize", this.getWindowDimensions);
  },

  computed: {
    ...mapGetters({
      player: "lobby/player",
      hiddenArtist: "lobby/hiddenArtist",
      isLeader: "lobby/isLeader",
    }),
    ...mapState({
      code: (state) => state.lobby.code,
      nextCode: (state) => state.lobby.nextCode,
    }),

    canvasSize() {
      return this.width > 768 ? 400 : 251;
    }
  },

  data() {
    return {
      showDirections: true,
      selection: null,
      voted: false,
      revealHiddenArtist: false,
      playerDirection: "Select the fake artist and click vote",
      loading: false,
      width: document.documentElement.clientWidth
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
      this.$socket.emit("lobby:get_next", this.code);
    },
  },

  methods: {
    
    getWindowDimensions() {
      this.width = document.documentElement.clientWidth;
    },

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

    playAgain() {
      this.loading = true;
      this.$socket.emit("lobby:join", {
        lobby: this.nextCode,
        playerName: this.player.name,
        isSpectator: this.player.isSpectator,
      });
    },

    exitGame() {
      this.$socket.emit("lobby:quit", this.playerId);
    },
  },
};
</script>
