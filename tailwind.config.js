/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "spotify-green": "#1db954",
        "spotify-dark": "#191414",
        "spotify-gray": "#121212",
      },
    },
  },
  plugins: [],
};
