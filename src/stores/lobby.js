import { getTransitionRawChildren } from "vue";

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

    isLeader(state, getters) {
      if (!getters.player) {
        return false;
      }
      const minTurnOrder = Math.min(...state.players.map((p) => p.order));
      return minTurnOrder === getters.player.order;
    },
  },

  mutations: {
    updateGameCode(state, code) {
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

    removePlayer(state, playerId) {
      const playerInd = state.players.findIndex((p) => p._id === playerId);
      state.players.splice(playerInd, 1);
    },
  },

  actions: {
    "SOCKET_success:lobby_joined"({ commit }, { gameLobby, playerId }) {
      commit("updateGameCode", gameLobby.room);
      commit("setPlayers", gameLobby.players);
      commit("updateSwatches", gameLobby.colors);
      commit("setPlayerId", playerId);
    },

    "SOCKET_success:lobby_quit"({ commit }) {
      commit("updateGameCode", null);
    },

    "SOCKET_success:player_quit"({ commit }, playerId) {
      commit("removePlayer", playerId);
    },

    "SOCKET_success:player_joined"({ commit }, player) {
      commit("addPlayer", player);
    },

    "SOCKET_success:colors_updated"({ commit }, player) {
      commit("updatePlayer", player);
    },

    "SOCKET_success:player_updated"({ commit }, player) {
      commit("updatePlayer", player);
    },

    updateGameCode({ commit }, code) {
      commit("updateGameCode", code);
    },
  },
};
