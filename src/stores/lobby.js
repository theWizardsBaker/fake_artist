import { defineStore } from "pinia";

export const useCounterStore = defineStore("lobby", () => {
  state: () => {
    return {
      id: null,
      players: [],
    };
  };
});
