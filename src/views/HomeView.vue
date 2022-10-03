<template>
  <main>
    <div class="hero min-h-screen bg-base-200">
      <div class="hero-content">
        <div class="max-w-md">
          <div class="flex justify-center items-center mr-1 gap-2">
            <h1 class="text-5xl font-bold handwriting py-5">Fake Artist</h1>
            <font-awesome-icon icon="fa-paintbrush" class="fa-2xl" />
          </div>
          <game-entry @join-game="joinGameLobby" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import GameEntry from "@/components/GameEntry.vue";

export default {
  name: "HomePage",
  components: { GameEntry },
  methods: {
    joinGameLobby(gameId) {
      this.$router.push({ name: "game-lobby", params: { gameId: gameId } });
    },
  },
};
</script>
