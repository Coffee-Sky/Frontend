/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        color1: {
          DEFAULT: "#22333B", // Gunmetal
          shade: "#161E22", // Eerie Black
        },
        color2: {
          DEFAULT: "#B8B5AF", // Silver
          shade: "#868A88", // Battleship Gray
        },
        color3: {
          DEFAULT: "#EAE0D5",  // Almond
          shade: "#DED3C8",
        },
        color4: {
          DEFAULT: "#D8C6B2", // Dun
          shade: "#C6AC8F", // Khaki
        },
        color5: {
          DEFAULT: "#927E67", // Beaver
          shade: "#5E503F", // Walnut Brown
        },
      },
    },
  },
  plugins: [],
}

