/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.{html,js}", "./dist/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: "yekan bakh",
      },
    },
  },
  plugins: [],
};
