import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import lobby from "./lobby.js";
import player from "./player.js";

export default createStore({
  modules: {
    lobby: lobby,
    player: player,
  },
  plugins: [createPersistedState()],
});
