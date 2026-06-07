/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1A6FE8",
          dark: "#1558C0",
          light: "#E8F1FD",
        },
      },
    },
  },
  plugins: [],
};

