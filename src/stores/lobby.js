export default {
  id: "lobby",

  namespaced: true,

  state: () => ({
    code: null,
    nextCode: null,
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

    orderedPlayers(state) {
      return state.players.sort((p1, p2) => p1.order - p2.order);
    },

    isLeader(state, getters) {
      if (!getters.player) {
        return false;
      }
      const minTurnOrder = Math.min(...state.players.map((p) => p.order));
      return minTurnOrder === getters.player.order;
    },

    hiddenArtist(state) {
      return state.players.filter((p) => p.isHiddenArtist)[0];
    },
  },

  mutations: {
    updateGameCode(state, code) {
      state.code = code;
    },

    updateNextGameCode(state, code) {
      state.nextCode = code;
    },

    updatePlayer(state, player) {
      state.players = state.players.map((p) => {
        return p._id === player._id ? player : p;
      });
    },

    updatePlayers(state, players) {
      state.players = players;
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

    removePlayer(state, playerId) {
      const playerInd = state.players.findIndex((p) => p._id === playerId);
      state.players.splice(playerInd, 1);
    },

    setHiddenArtist(state, hiddenArtistId) {
      state.players.forEach((p) => {
        if (p._id === hiddenArtistId) {
          p.isHiddenArtist = true;
        }
      });
    },

    setPlayerVotes(state, votes) {
      const players = state.players.forEach((p) => (p.votes = votes[p._id]));
    },
  },

  actions: {
    "SOCKET_success:lobby_joined"({ commit }, { gameLobby, playerId }) {
      commit("updateGameCode", gameLobby.room);
      commit("updateNextGameCode", null);
      commit("setPlayers", gameLobby.players);
      commit("updateSwatches", gameLobby.colors);
      commit("setPlayerId", playerId);
    },

    "SOCKET_success:game_started"({ commit },{ players }) {
      commit("setPlayers", players);
    },

    "SOCKET_success:lobby_quit"({ commit }) {
      commit("updateGameCode", null);
    },

    "SOCKET_success:fetch_players"({ commit }, { players, colors }) {
      commit("setPlayers", players);
      commit("updateSwatches", colors);
    },

    "SOCKET_success:game_quit"({ commit }) {
      commit("updateGameCode", null);
    },

    "SOCKET_success:player_quit"({ commit }, playerId) {
      commit("removePlayer", playerId);
    },

    "SOCKET_success:player_joined"({ commit }, player) {
      commit("addPlayer", player);
    },

    "SOCKET_success:player_updated"({ commit }, player) {
      commit("updatePlayer", player);
    },

    "SOCKET_success:players_updated"({ commit }, players) {
      commit("updatePlayers", players);
    },

    "SOCKET_success:colors_updated"({ commit }, player) {
      commit("updatePlayer", player);
    },

    "SOCKET_success:voting_complete"({ commit }, { hiddenArtist, votes }) {
      commit("setHiddenArtist", hiddenArtist);
      commit("setPlayerVotes", votes);
    },

    "SOCKET_success:lobby_next"({ commit }, gameCode) {
      commit("updateNextGameCode", gameCode);
    },

  },
};
