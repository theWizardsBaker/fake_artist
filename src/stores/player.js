import { defineStore } from "pinia";

export default defineStore("player", {
  state: () => ({
    id: null,
    isArtist: false,
    name: null,
    color: null,
  }),
});
