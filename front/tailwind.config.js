module.exports = {
  mode: "jit",
  purge: {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    options: {
      safelist: ["bg-bistre"],
    },
  },
  theme: {
    extend: {
      colors: {
        bistre: "#362417",
        cinereous: "#92817a",
        dutchwhite: "#f1dabf",
        richblack: "#04030f",
        richwhite: "#fffbff",
      },
    },
  },
  plugins: [],
};
