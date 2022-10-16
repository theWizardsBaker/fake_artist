<template>
  <main>
    <base-page>
      <div class="max-w-md">
        <div class="flex justify-center items-center mr-1 gap-2">
          <h1 class="text-5xl font-bold handwriting py-5">Fake Artist</h1>
          <font-awesome-icon icon="fa-paintbrush" class="fa-2xl" />
        </div>
        <card>
          <div class="flex flex-col w-full border-opacity-50">
            <div class="tabs pb-5">
              <a
                v-for="(form, formInd) in gameForms"
                :class="[
                  'tab tab-bordered tab-lg flex-1',
                  formInd === formToShow && 'tab-active',
                ]"
                @click="setTab(formInd)"
              >
                {{ form }}
              </a>
            </div>
            <alert alertLevel="error" v-show="error.show">
              <template v-slot:content>
                <span class="text-xs">{{ error.message }}</span>
              </template>
            </alert>
            <div class="p-3">
              <!-- join form -->
              <game-join v-if="formToShow === 0" @error="handleError" />
              <!-- create form -->
              <game-create v-if="formToShow === 1" @error="handleError" />
            </div>
          </div>
        </card>
      </div>
    </base-page>
  </main>
</template>

<script>
import GameJoin from "@/components/GameJoin.vue";
import GameCreate from "@/components/GameCreate.vue";
import Alert from "@/components/ui/Alert.vue";
import BasePage from "@/components/ui/BasePage.vue";
import Card from "@/components/ui/Card.vue";

export default {
  name: "HomePage",

  components: {
    GameJoin,
    GameCreate,
    Alert,
    BasePage,
    Card,
  },

  data() {
    return {
      formToShow: 0,
      gameForms: ["Join Game", "Create Game"],
      error: {
        message: "",
        show: false,
      },
    };
  },

  methods: {
    handleError(msg) {
      // possible errors:
      /* game in progress, gamedoes not exist, could not join, could not create, general error */
      this.error.message = msg;
      this.error.show = true;
    },

    setTab(index) {
      this.error.show = false;
      this.formToShow = index;
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
