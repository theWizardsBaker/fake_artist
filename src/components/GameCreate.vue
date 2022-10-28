<template>
  <section>
    <div>
      <label class="label text-xs mb-2"> Game Rounds (default 2)</label>
      <input
        type="range"
        :min="0"
        :max="roundLimits.length - 1"
        v-model="rounds"
        class="range"
        step="1"
      />
      <div class="w-full flex justify-between text-xs px-2 pb-5">
        <span v-for="roundLimit in roundLimits">{{ roundLimit }}</span>
      </div>
    </div>
    <div>
      <label class="label text-xs mb-2"> Turn Time Limit (Seconds) </label>
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

    <div class="form-control w-full">
      <!-- name input -->
      <label class="label text-xs"> Player Name </label>
      <input
        type="text"
        v-model="name"
        placeholder="Name"
        class="input input-bordered w-[100%] mb-5 text-center"
        maxlength="25"
      />
    </div>

    <!-- create button -->
    <game-entry-button
      @click="createNewGame()"
      class="btn-success"
      :loading="loading"
      :disabled="loading || name.length < 1"
    >
      Create
    </game-entry-button>
  </section>
</template>

<script>
import GameEntryButton from "@/components/GameEntryButton.vue";
import Modal from "@/components/ui/Modal.vue";

export default {
  name: "GameEntry",

  components: {
    GameEntryButton,
    Modal,
  },

  data() {
    return {
      loading: false,
      turnTimeLimit: 0,
      timeLimits: ["15", "30", "60"],
      rounds: 0,
      roundLimits: ["2", "3", "4"],
      name: "",
    };
  },

  sockets: {
    "success:lobby_created"(gameId) {
      this.$socket.emit("lobby:join", {
        lobby: gameId,
        playerName: this.name,
      });
    },

    "error:lobby_created"(response) {
      this.loading = false;
      this.$emit("error", `Error: ${response}`);
    },

    "error:lobby_joined"(errorMsg) {
      this.gameId = "";
      this.loading = false;
      this.$emit("error", `Unable to create game`);
    },
  },

  methods: {
    createNewGame() {
      const timeLimit =
        this.turnTimeLimit > this.timeLimits.length
          ? this.timeLimits[this.turnTimeLimit]
          : null;
      this.loading = true;
      this.$socket.emit("lobby:create", {
        maxRounds: this.roundLimits[this.rounds],
        timeLimit: this.timeLimits[this.turnTimeLimit],
      });
    },
  },
};
</script>
