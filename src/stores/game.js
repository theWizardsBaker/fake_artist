export default {
  id: "game",

  namespaced: true,

  state: () => ({
    inProgress: false,
  }),

  mutations: {
    startGame(state) {
      state.inProgress = true;
    },
  },

  actions: {
    "SOCKET_success:game_started"({ commit }) {
      commit("startGame");
    },
  },
};
