import { defineStore } from "pinia";

export const useCounterStore = defineStore("lobby", () => {
  state: () => {
    return {
      gameId: null,
      players: [
      	{ 
      		name: "Joe",
      		color: "#44523",
      		ready: false,
		},
        { 
        	name: "bob",
        	color: "#44523",
        	ready: false,
		},
        { 
        	name: "Steave",
        	color: "#44523",
        	ready: false,
		},
        { 
        	name: "Justing",
        	color: "#44523",
        	ready: false,
		},
        { 
        	name: "John",
        	color: "#44523",
        	ready: false,
		},
        { 
        	name: "Jeanne",
        	color: "#44523",
        	ready: false,
		},
      ],
      swatches: [
		"#1FBC9C",
		"#1CA085",
		"#2ECC70',
		"#27AF60",
		"#3398DB",
		"#2980B9",
		"#A463BF",
		"#8E43AD",
		"#3D556E",
		"#222F3D",
		"#F2C511",
      ]
    };
  };
});
