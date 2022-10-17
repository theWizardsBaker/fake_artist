export default {
  id: "game",

  namespaced: true,

  state: () => ({
    inProgress: false,
    playerTurn: 0,
  }),

  mutations: {
    startGame(state) {
      state.inProgress = true;
    },
    endGame(state) {
      state.inProgress = false;
    },
    setTurn(state, turn) {
      state.playerTurn = turn;
    },
  },

  actions: {
    "SOCKET_success:game_started"({ commit }) {
      commit("startGame");
    },

    "SOCKET_success:game_turn"({ commit }, turn) {
      commit("setTurn", turn);
    },

    "SOCKET_success:lobby_quit"({ commit }) {
      commit("endGame");
    },

    endGame({ commit }) {
      commit("endGame");
    },
  },
};
