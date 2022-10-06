module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
    extend: {
      colors: {
        bg: "#fdf6de",
        blue: "#def0ff",
        orange: "#FC9422",
        brown: "#aa9b8a",
        brownDark: "#57442e",
        yellow: "#EFE256",
        dark: "#323531",
        grey: "#838383",
      },
    },
  },
  plugins: [],
  important: true,
};
