<template>
  <main>
    <div class="hero min-h-screen bg-base-200">
      <div class="hero-content">
        <div class="max-w-md">
          <div class="flex justify-center items-center mr-1 gap-2">
            <h1 class="text-5xl font-bold handwriting py-5">Fake Artist</h1>
            <font-awesome-icon icon="fa-paintbrush" class="fa-2xl" />
          </div>
          <div class="card sm:w-[27rem] bg-base-100 shadow-xl">
            <div class="card-body">
              <div class="flex flex-col w-full border-opacity-50">
                <div class="tabs">
                  <a 
                    v-for="(form, formInd) in gameForms"
                    :class="[
                      'tab tab-bordered tab-lg flex-1',
                      (formInd === formToShow) && 'tab-active'
                    ]"
                    @click="formToShow = formInd"
                  >
                    {{form}}
                  </a> 
                </div>
                <alert alertLevel="error" v-show="error.show">
                  <template v-slot:content>
                    <span class="text-xs">{{ error.message }}</span>
                  </template>
                </alert>
                <div class="p-3 pt-5">
                    <!-- join form -->
                    <game-join
                      v-if="formToShow === 0"
                      @success="createPlayer"
                      @error="handleError"
                      @clicked="disabled = true"
                    />
                    <!-- create form -->
                    <game-create
                      v-if="formToShow === 1"
                      @success="createPlayer"
                      @error="handleError"
                      @clicked="disabled = true"
                    />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { FadeInOut } from 'vue3-transitions';
import GameJoin from "@/components/GameJoin.vue";
import GameCreate from "@/components/GameCreate.vue";
import Alert from "@/components/ui/Alert.vue";

export default {
  name: "HomePage",
  
  components: { 
    GameJoin,
    GameCreate,
    Alert,
    FadeInOut
  },
  
  data() {
    return {
      formToShow: 0,
      gameForms: ['Join Game', 'Create Game'],
      error: {
        message: "",
        show: false
      }
    }
  },
  
  methods: {

    handleError(msg) {
      // possible errors:
      /* game in progress, gamedoes not exist, could not join, could not create, general error */
      this.error.message = msg;
      this.error.show = true;
    },

    createPlayer(gameId) {
      this.$router.push({ name: "player-create", params: { gameId: gameId } });
    },

  },
};
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
