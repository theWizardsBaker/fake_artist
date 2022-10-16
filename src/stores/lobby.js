export default {
  id: "lobby",

  namespaced: true,

  state: () => ({
    code: null,
    playerId: null,
    players: [],
    swatches: [],
  }),

  getters: {
    colorSwatches(state) {
      const playerColors = state.players.map((p) => p.color);
      return state.swatches.map((s) => {
        s.disabled = playerColors.includes(s.color);
        return s;
      });
    },
    player(state) {
      return state.players.find((p) => p._id === state.playerId);
    },
  },

  mutations: {
    updateGameId(state, code) {
      state.code = code;
    },

    updatePlayer(state, player) {
      state.players = state.players.map((p) => {
        return p._id === player._id ? player : p;
      });
    },

    updateSwatches(state, swatches) {
      state.swatches = swatches;
    },

    setPlayers(state, players) {
      state.players = players;
    },

    setPlayerId(state, playerId) {
      state.playerId = playerId;
    },

    addPlayer(state, player) {
      state.players.push(player);
    },

    removePlayer(state, player) {
      const playerInd = state.players.findIndex((p) => p.id === player.id);
      if (playerInd) {
        state.players.splice(playerInd, 1);
      }
    },
  },

  actions: {
    "SOCKET_success:lobby_joined"(
      { commit },
      { room, players, colors, playerId }
    ) {
      commit("updateGameId", room);
      commit("setPlayers", players);
      commit("updateSwatches", colors);
      commit("setPlayerId", playerId);
    },

    "SOCKET_success:lobby_quit"({ commit }) {
      commit("updateGameId", null);
    },

    "SOCKET_success:player_joined"({ commit }, player) {
      commit("addPlayer", player);
    },

    "SOCKET_success:player_left"({ commit }, player) {
      commit("removePlayer", player);
    },

    "SOCKET_success:colors_updated"({ commit }, player) {
      commit("updatePlayer", player);
    },

    "SOCKET_success:player_updated"({ commit }, player) {
      commit("updatePlayer", player);
    },

    updateGameId({ commit }, code) {
      commit("updateGameId", code);
    },
  },
};
