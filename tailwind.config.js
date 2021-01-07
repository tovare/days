module.exports = {
  purge: {
    enabled: process.env.NODE_ENV == "xx",
    content: ["./src/**/*.html", "./src/**/*.js"],
  },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateRows: {
        '8': 'repeat(8, minmax(0, 1fr))',
        '12': 'repeat(12, minmax(0, 1fr))',
        '31': 'repeat(31, minmax(0, 1fr))',
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
