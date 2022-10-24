<template>
  <main>
    <base-page>
      <div class="max-w-md">
        <div class="flex flex-col">
          <div class="text-center">
            <h2>Vote</h2>
            Select who is the fake artist
          </div>
          <card>
            <player-list @selected="setSelection" showSelect />
            <button class="btn btn-outline mx-6" :disabled="!selection">
              Vote
            </button>
          </card>
        </div>
      </div>
    </base-page>
  </main>
</template>

<script>
import PlayerList from "@/components/PlayerList.vue";
import BasePage from "@/components/ui/BasePage.vue";
import Card from "@/components/ui/Card.vue";

export default {
  name: "VotePage",

  components: {
    PlayerList,
    BasePage,
    Card,
  },

  data() {
    return {
      selection: null,
    };
  },

  methods: {
    setSelection(player) {
      this.selection = player;
    },
  },
};
</script>
