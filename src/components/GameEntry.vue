<template>
  <section class="card sm:w-96 bg-base-100 shadow-xl">
    <div class="card-body">
      <div class="flex flex-col w-full border-opacity-50">
        <div class="p-3">
          <div class="form-control w-full max-w-xs">
            <!-- Game Code Input -->
            <label class="label text-xs">
              Enter a code to join an existing game
            </label>
            <input
              type="text"
              placeholder="Game Code"
              class="
                input
                input-bordered
                input-lg
                text-2xl
                sm:text-3xl
                w-full
                max-w-xs
                mb-5
                text-center
              "
              :value="gameId"
            />
          </div>
          <!-- join button -->
          <game-entry-button
            @click="checkCode()"
            :disabled="disabled"
            class="btn-outline btn-info"
          >
            Join
          </game-entry-button>
        </div>
        <div class="divider">OR</div>
        <div class="p-3">
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

export default {
  components: {
    GameEntryButton,
    Modal,
  },

  data() {
    return {
      gameId: "3214234",
      loading: false,
      disabled: false,
    };
  },

  methods: {
    checkCode() {
      // check that game exists
      if(true){
        this.$emit("joinGame", this.gameId)
      }
    },
    createNewGame() {
      // fetch a new game's id
      this.$emit("joinGame", this.gameId)
    },
    errorModal() {
      // possible errors:
      /* game in progress, gamedoes not exist, could not join, could not create, general error */
      alert("HELLO");
    },
  },
};
</script>
