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

  plugins: [],
};

module.exports = config;
