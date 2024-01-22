/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  plugins: [require("daisyui")],
  theme: {
    extend: {},
    fontFamily: {
      broadway: ['broadway'],
      nunito: ['nunito']
    }
  },

};

module.exports = config;
