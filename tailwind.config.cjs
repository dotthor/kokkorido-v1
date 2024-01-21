/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {},
    fontFamily: {
      broadway: ['broadway'],
      nunito: ['nunito']
    }
  },

  plugins: [require("daisyui")],
};

module.exports = config;
