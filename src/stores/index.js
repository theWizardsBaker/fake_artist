import { createStore } from "vuex";
import lobby from "./lobby.js";
import player from "./player.js";
import color from "./color.js";

export default createStore({
  modules: {
    lobby: lobby,
    player: player,
    color: color
  },
});
