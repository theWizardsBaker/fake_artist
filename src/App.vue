<template>
  <navigation>
    <h1 class="text-2xl font-bold handwriting">Fake Artist</h1>
    <font-awesome-icon icon="fa-paintbrush" />
  </navigation>

  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'fade'">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
import { RouterView } from "vue-router";
import Navigation from "@/components/ui/Navigation.vue";

export default {
  components: {
    Navigation,
    RouterView,
  },
};
</script>
