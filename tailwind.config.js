/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        dusk: {
          900: "#0B121C",
          800: "#101823",
          700: "#17212F",
          600: "#202C3C",
          500: "#324156"
        },
        mist: {
          400: "#8CA0B3",
          200: "#C7D3DE",
          100: "#EAF0F6"
        },
        sun: {
          500: "#FFB454",
          400: "#FFC97A"
        },
        teal: {
          500: "#5EC8D8",
          400: "#8AD9E4"
        },
        storm: {
          500: "#EE6B6B"
        }
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"]
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: []
};
