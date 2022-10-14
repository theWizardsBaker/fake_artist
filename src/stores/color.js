export default {
  id: "color",

  namespaced: true,

  state: () => ({
    swatches: [],
  }),

  mutations: {

    updateSwatches(state, colors) {
      state.swatches = colors;
    },

  },

  actions: {
    
    "SOCKET_success:colors_get"(color) {
      commit("updateSwatches", color);
    },

    "SOCKET_success:colors_update"({ commit }, colors) {
      commit("updateSwatches", colors);
    },

  },
};
