<template>
  <main class="hero min-h-screen bg-base-200">
    <div class="hero-content">    
      <div class="flex justify-center">
        <div class="flex flex-col">
          <div class="p-4 text-center">
            <label>Game Code</label>
            <h3 class="font-medium text-6xl my-3 border-2 p-3 rounded-2xl">
              {{ $route.params.gameId }}
            </h3>
          </div>
          <div class="card sm:w-[25rem] bg-base-100 shadow-xl">
            <alert alertLevel="error" v-show="error.show">
              <template v-slot:content>
                <span class="text-xs">{{ error.message }}</span>
              </template>
            </alert>
            <player-create
              @success="created"
              @error="error"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import PlayerCreate from "@/components/PlayerCreate.vue";
import Alert from "@/components/ui/Alert.vue";

export default {
  components: {
    PlayerCreate,
    Alert
  },

  data() {
    return {
      error: {
        message: "",
        show: false
      }
    };
  },

  methods: {
    created() {

    },
    error() {

    }
  },
};
</script>
