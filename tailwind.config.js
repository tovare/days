module.exports = {
  purge: {
    enabled: process.env.NODE_ENV == "xx",
    content: ["./src/**/*.html", "./src/**/*.js"],
  },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
