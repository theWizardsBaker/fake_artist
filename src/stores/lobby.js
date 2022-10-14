export default {
  id: "lobby",

  namespaced: true,

  state: () => ({
    gameId: null,
    players: [],
    swatches: []
  }),

  mutations: {

    updateGameId(state, gameId) {
      state.gameId = gameId;
    },

    updateSwatches(state, colors) {
      state.swatches = colors;
    },

    setPlayers(state, players) {
      state.players = players
    },

    addPlayer(state, player) {
      state.players.push(player)
    },

    removePlayer(state, player) {
      const playerInd = state.players.findIndex((p) => p.id === player.id)
      if(playerInd){
        state.players.splice(playerInd, 1)
      }
    },

  },

  actions: {

    "SOCKET_success:lobby_joined"({ commit }, { room, players, colors }) {
      commit("updateGameId", room);
      commit("setPlayers", players);
      commit("updateSwatches", colors);
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

    "SOCKET_success:colors_update"({ commit }, colors) {
      commit("updateSwatches", colors);
    },

    "SOCKET_success:colors_updated"({ commit }, colors) {
      commit("updateSwatches", colors);
    },

    "SOCKET_failed:colors_updated"({ commit }, colors) {
      commit("updateSwatches", colors);
    },

    updateGameId({ commit }, gameId) {
      commit("updateGameId", gameId);
    },

  },
};
