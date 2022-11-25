/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    animatedSettings: {
      animatedSpeed: 1000,
      heartBeatSpeed: 500,
      hingeSpeed: 2000,
      bounceInSpeed: 750,
      bounceOutSpeed: 750,
      animationDelaySpeed: 500,
      classes: ['fadeInRight', 'fadeOutRight']
    }
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"),
    require('tailwindcss-animatecss'),
  ],
  daisyui: {
    themes: ["business", "coffee", "cupcake", "pastel", "winter"],
  },
};
