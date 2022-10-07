<template>
  <section class="card sm:w-96 bg-base-100 shadow-xl">
    <div class="card-body">
      <div class="flex flex-col w-full border-opacity-50">
        <alert alertLevel="error" v-show="error">
          <template v-slot:content>
            <span class="text-xs">{{ errorMessage }}</span>
          </template>
        </alert>
        <div class="p-3">
          <div class="form-control w-full max-w-xs">
            <!-- Game Code Input -->
            <label class="label text-xs">
              Enter a code to join an existing game
            </label>
            <input
              type="text"
              placeholder="Game Code"
              class="input input-bordered input-lg text-2xl sm:text-3xl w-full max-w-xs mb-5 text-center"
              v-model="gameId"
            />
          </div>
          <!-- join button -->
          <game-entry-button
            @click="checkCode()"
            :disabled="disabled || gameId.length < 1"
            class="btn-outline btn-info"
          >
            Join
          </game-entry-button>
        </div>
        <div class="divider">OR</div>
        <div class="p-3">
          <div>
            <label class="label text-xs"> Turn Time Limit (Seconds) </label>
            <input
              type="range"
              min="0"
              :max="timeLimits.length"
              v-model="turnTimeLimit"
              class="range"
              step="1"
            />
            <div class="w-full flex justify-between text-xs px-2 pb-5">
              <span v-for="timeLimit in timeLimits">{{ timeLimit }}</span>
              <span class="text-2xl align-top mt-[-9px]">&infin;</span>
            </div>
          </div>
          <!-- create button -->
          <game-entry-button
            @click="createNewGame()"
            :disabled="disabled"
            class="btn-outline btn-success"
          >
            Create
          </game-entry-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import GameEntryButton from "@/components/GameEntryButton.vue";
import Modal from "@/components/ui/Modal.vue";
import Alert from "@/components/ui/Alert.vue";

export default {
  name: "GameEntry",

  components: {
    GameEntryButton,
    Modal,
    Alert,
  },

  data() {
    return {
      gameId: "",
      turnTimeLimit: 0,
      loading: false,
      disabled: false,
      error: false,
      errorMessage: "",
      timeLimits: ["15", "30", "60"],
    };
  },

  sockets: {
    "error:game_not_found"(response) {
      this.errorModal(`Could not join game: ${response}`);
    },
  },

  methods: {
    checkCode() {
      this.$socket.emit("lobby:join", this.gameId);
    },

    createNewGame() {
      const timeLimit =
        this.turnTimeLimit > this.timeLimits.length
          ? this.timeLimits[this.turnTimeLimit]
          : null;
      this.$socket.emit("game:create", timeLimit);
    },

    errorModal(msg) {
      // possible errors:
      /* game in progress, gamedoes not exist, could not join, could not create, general error */
      this.errorMessage = msg;
      this.error = true;
    },
  },
};
</script>
