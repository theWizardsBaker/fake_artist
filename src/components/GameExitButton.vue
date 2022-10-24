<template>
  <div>
    <modal :show="showExitConfirmation">
      <template v-slot:title> Exit game? </template>
      <template v-slot:body>
        Quitting will end the game for all players. Are you sure you want to
        quit?
      </template>
      <template v-slot:action>
        <button class="btn btn-info" @click="showExitConfirmation = false">
          Cancel
        </button>
        <button
          class="btn btn-warning"
          @click="quitGame()"
          :disabled="!exitConfirmationEnabled"
        >
          Quit
        </button>
      </template>
    </modal>
    <button
      class="btn btn-info btn-outline text-center rounded-2xl m-5 gap-2"
      :disabled="disabled"
      @click="showExitConfirmation = true"
    >
      End Game <font-awesome-icon icon="fa-right-from-bracket" />
    </button>
  </div>
</template>

<script>
import Modal from "@/components/ui/Modal.vue";

export default {
  components: {
    Modal,
  },

  props: {
    loading: Boolean,
    disabled: Boolean,
  },

  watch: {
    showExitConfirmation(newVal) {
      if (newVal) {
        setTimeout(() => (this.exitConfirmationEnabled = true), "2000");
      } else {
        this.exitConfirmationEnabled = false;
      }
    },
  },

  data() {
    return {
      showExitConfirmation: false,
      exitConfirmationEnabled: false,
    };
  },

  methods: {
    quitGame() {
      this.$socket.emit("game:quit");
    },
  },
};
</script>
