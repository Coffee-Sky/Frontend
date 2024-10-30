/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        color1: {
          DEFAULT: "#0F766E", // teal-700
          shade: "#115E59", // teal-800
        },
        color2: {
          DEFAULT: "#F3F4F6", // gray-100
          shade: "#E5E7EB", // gray-200
        },
        color3: {
          DEFAULT: "#ccfbf1",  // teal-100
          shade: "#f0fdfa", // teal-50
        },
        color4: {
          DEFAULT: "#0D9488", // teal-600
          shade: "#0F766E", // teal-700
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

