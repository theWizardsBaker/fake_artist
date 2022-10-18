export default {
  id: "game",

  namespaced: true,

  state: () => ({
    inProgress: false,
    playerTurn: 0,
    topic: {
      category: "",
      subject: "",
    },
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
    setTopic(state, { category, subject }) {
      state.topic.category = category;
      state.topic.subject = subject;
    },
  },

  actions: {
    "SOCKET_success:game_started"({ commit }) {
      commit("startGame");
    },

    "SOCKET_success:game_turn"({ commit }, turn) {
      commit("setTurn", turn);
    },

    "SOCKET_success:game_topic"({ commit }, topic) {
      commit("setTopic", topic);
    },

    "SOCKET_success:lobby_quit"({ commit }) {
      commit("endGame");
    },

    endGame({ commit }) {
      commit("endGame");
    },
  },
};
