import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/game/:gameId",
      component: () => import("@/views/GameView.vue"),
      children: [
        {
          path: "lobby",
          name: "game-lobby",
          component: () => import("@/views/LobbyView.vue"),
        },
        {
          path: "play",
          name: "game-play",
          component: () => import("@/views/PlayView.vue"),
        },
        {
          path: "vote",
          name: "game-vote",
          component: () => import("@/views/VoteView.vue"),
        },
      ],
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
