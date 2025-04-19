// tailwind.config.js
export default {
  theme: {
    extend: {
      animation: {
        shimmer: "shimmer 3s infinite linear",
        "fade-in": "fadeIn 1s ease-out forwards",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      backgroundSize: {
        shimmer: "1400px 100%",
      },
    },
  },
  plugins: [],
};
