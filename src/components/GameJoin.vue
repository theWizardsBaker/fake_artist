<template>
  <section>
    <div class="form-control w-full">
      <!-- Game Code Input -->
      <label class="label text-xs">
        Enter a code to join an existing game
      </label>
      <input
        type="text"
        placeholder="Game Code"
        class="input input-bordered input-lg text-2xl sm:text-3xl w-fill mb-5 text-center"
        v-model="gameId"
      />
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

    <div class="form-control mb-5">
      <label class="label cursor-pointer">
        <span class="label-text">Spectator</span>
        <input v-model="spectator" type="checkbox" class="checkbox" />
      </label>
    </div>

    <!-- join button -->
    <game-entry-button
      @click="findLobby"
      :loading="loading"
      :disabled="loading || gameId.length < 1 || name.length < 1"
      class="btn-outline btn-info"
    >
      Join
    </game-entry-button>
  </section>
</template>

<script>
import GameEntryButton from "@/components/GameEntryButton.vue";

export default {
  name: "GameEntry",

  components: {
    GameEntryButton,
  },

  data() {
    return {
      gameId: "",
      loading: false,
      name: "",
      spectator: false,
    };
  },

  sockets: {
    "success:lobby_found"(gameId) {
      this.$socket.emit("lobby:join", {
        lobby: gameId,
        playerName: this.name,
        isSpectator: this.spectator,
      });
    },

    "error:lobby_found"(errorMsg) {
      this.gameId = "";
      this.loading = false;
      this.$emit("error", `Game not found: ${errorMsg}`);
    },

    "error:lobby_joined"(errorMsg) {
      this.gameId = "";
      this.loading = false;
      this.$emit("error", `Error: ${errorMsg}`);
    },
  },

  methods: {
    findLobby() {
      this.loading = true;
      this.$socket.emit("lobby:find", this.gameId);
    },
  },
};
</script>
