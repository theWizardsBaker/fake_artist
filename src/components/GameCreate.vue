<template>
  <section>
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
      <label class="label text-xs">
        Player Name
      </label>
      <input
        type="text"
        v-model="name"
        placeholder="Name"
        class="input input-bordered w-[100%] mb-5 text-center"
        maxlength="25"
      />
    </div>

    <div class="form-control mb-5">
      <label class="label cursor-pointer">
        <span class="label-text">Spectator</span> 
        <input v-model="spectator" type="checkbox" class="checkbox" />
      </label>
    </div>

    <!-- create button -->
    <game-entry-button
      @click="createNewGame()"
      class="btn-outline btn-success"
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
      spectator: false,
      name: ""
    };
  },

  sockets: {
    
    "success:lobby_created"(gameId) {
      this.$emit("success", gameId);
    },

    "error:lobby_created"(response) {
      this.loading = false;
      this.$emit("error", `Error: ${response}`);
    },

  },
  
  methods: {

    createNewGame() {
      const timeLimit =
        this.turnTimeLimit > this.timeLimits.length
          ? this.timeLimits[this.turnTimeLimit]
          : null
      this.loading = true
      this.$socket.emit("lobby:create", timeLimit)
    },

  },
};
</script>
