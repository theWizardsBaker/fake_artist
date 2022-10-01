import { defineStore } from "pinia";

export default defineStore("lobby", {
  id: "lobby",
  state: () => ({
    gameId: null,
    players: [
      {
        id: 1,
        name: "Joe",
        color: "#ffffff",
        isReady: false,
      },
      {
        id: 2,
        name: "bob",
        color: "#ffffff",
        isReady: false,
      },
      {
        id: 3,
        name: "Steave",
        color: "#ffffff",
        isReady: true,
      },
      {
        id: 4,
        name: "Justing",
        color: "#ffffff",
        isReady: true,
      },
      {
        id: 5,
        name: "John",
        color: "#ffffff",
        isReady: true,
      },
      {
        id: 6,
        name: "Jeanne",
        color: "#ffffff",
        isReady: true,
      },
    ],
    swatches: [
      "#1FBC9C",
      "#1CA085",
      "#2ECC70",
      "#27AF60",
      "#3398DB",
      "#2980B9",
      "#A463BF",
      "#8E43AD",
      "#3D556E",
      "#222F3D",
      "#F2C511",
    ],
  }),
});
