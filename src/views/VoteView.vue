<template>
  <main>
    <base-page>
      <div class="max-w-md">
        <div class="flex flex-col gap-5">
          <div class="p-4 text-center">
            <h3 class="text-5xl font-bold">Vote</h3>
          </div>
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
              <div v-else class="p-2">Select the fake artist</div>
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
  </main>
</template>

<script>
import PlayerList from "@/components/PlayerList.vue";
import GameExitButton from "@/components/GameExitButton.vue";
import BasePage from "@/components/ui/BasePage.vue";
import Card from "@/components/ui/Card.vue";
import { mapGetters, mapState } from "vuex";

export default {
  name: "VotePage",

  components: {
    PlayerList,
    BasePage,
    Card,
    GameExitButton,
  },

  mounted() {
    this.$socket.emit("game:voted", this.player._id);
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
    };
  },

  methods: {
    setSelection(player) {
      this.selection = player;
    },

    vote() {
      this.voted = true;
      this.$socket.emit("game:vote", this.player._id, this.selection);
    },
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
};
</script>
