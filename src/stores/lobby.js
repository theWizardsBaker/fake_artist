export default {
  id: "lobby",

  namespaced: true,

  state: () => ({
    gameId: null,
    players: [],
    swatches: [],
  }),

  mutations: {
    gameId(state, lobby) {
      state.gameId = lobby;
    },

    addPlayer(state, player) {},

    removePlayer(state, player) {},
  },

  actions: {
    "SOCKET_success:lobby_joined"({ commit }, lobby) {
      commit("gameId", lobby);
    },

    "SOCKET_success:player_joined"({ commit }, player) {
      commit("addPlayer", player);
    },

    "SOCKET_success:player_left"({ commit }, player) {
      commit("gameId", player);
    },
  },
};
