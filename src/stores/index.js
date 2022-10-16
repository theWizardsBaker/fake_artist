import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import lobby from "./lobby.js";
import game from "./game.js";

export default createStore({
  modules: {
    lobby: lobby,
    game: game,
  },
  plugins: [createPersistedState()],
});
