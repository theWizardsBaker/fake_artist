const DEFAULT_STATE = () => ({
  timeLimit: 0,
  inProgress: false,
  playerCount: 0,
  playerTurn: 0,
  round: 0,
  maxRounds: 0,
  topic: null,
  selectedPlayer: null,
});

export default {
  id: "game",

  namespaced: true,

  state: () => DEFAULT_STATE(),

  getters: {
    isGameOver(state) {
      return state.round == state.maxRounds;
    },
  },

  mutations: {
    startGame(state) {
      state.inProgress = true;
    },
    endGame(state) {
      state.inProgress = false;
    },
    setTimeLimit(state, timeLimit) {
      state.timeLimit = timeLimit;
    },
    setRound(state, round) {
      state.round = round;
    },
    setMaxRounds(state, maxRounds) {
      state.maxRounds = maxRounds;
    },
    setTurn(state, turn) {
      state.playerTurn = turn;
    },
    setPlayerCount(state, turns) {
      state.playerCount = turns;
    },
    setTopic(state, topic) {
      state.topic = topic;
    },
    clearTopic(state) {
      state.topic.category = null;
      state.topic.subject = null;
    },
    incrementPlayerTurn(state) {
      if (state.playerTurn + 1 >= state.playerCount) {
        state.playerTurn = 0;
        state.round += 1;
      } else {
        state.playerTurn += 1;
      }
    },
    leaveGame(state) {
      // reset to default state
      state = DEFAULT_STATE();
    },
    selectPlayer(state, player) {
      state.selectedPlayer = player;
    },
  },

  actions: {
    "SOCKET_success:game_started"(
      { commit },
      { players, timeLimit, maxRounds }
    ) {
      commit("setPlayerCount", players);
      commit("setTimeLimit", timeLimit);
      commit("setMaxRounds", maxRounds);
      commit("setTopic");
      commit("startGame");
      commit("setRound", 0);
    },

    "SOCKET_success:lobby_rejoin_game"(
      { commit },
      { turnNumber, roundNumber }
    ) {
      commit("setTurn", turnNumber);
      commit("setRound", roundNumber);
    },

    "SOCKET_success:game_topic"({ commit }, topic) {
      commit("setTopic", topic);
    },

    "SOCKET_success:game_turn"({ commit }, turn) {
      commit("setTurn", turn);
    },

    "SOCKET_success:set_drawing"({ commit }) {
      commit("incrementPlayerTurn");
    },

    "SOCKET_success:game_quit"({ commit }) {
      commit("leaveGame");
    },

    "SOCKET_success:lobby_quit"({ commit }) {
      commit("endGame");
    },

    endGame({ commit }) {
      commit("endGame");
    },

    filterPlayer({ commit }, player) {
      console.log("HELLOOOOO", player);
      commit("selectPlayer", player);
    },
  },
};
