import { defineStore } from "pinia";

export const playerStore = defineStore("player", () => {
  state: () => {
    return {
      id: null,
      isArtist: false,
      name: null,
      color: null,
    };
  };
});
