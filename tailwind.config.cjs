const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        "editor-primary": "var(--wick-editor-primary)",
        "editor-secondary": "var(--wick-editor-secondary)",
        "editor-tertiary": "var(--wick-editor-tertiary)",
        "editor-text-primary": "var(--wick-editor-text-primary)",
        "editor-text-secondary": "var(--wick-editor-text-secondary)",
        "editor-modal-gray": "var(--wick-editor-modal-gray)",
        "editor-modal-text": "var(--wick-editor-modal-text-gray)",
        "wick-green": "var(--wick-green)",
        "wick-green-light": "var(--wick-green-light)",
        "wick-green-dark": "var(--wick-green-dark)",
        "wick-red": "var(--wick-red)",
        "wick-red-light": "var(--wick-red-light)",
        "wick-red-dark": "var(--wick-red-dark)",
        "wick-yellow": "var(--wick-yellow)",
        "wick-yellow-light": "var(--wick-yellow-light)",
        "wick-yellow-dark": "var(--wick-yellow-dark)",
      },
      borderRadius: {
        wick: "var(--wick-input-roundness)",
        "wick-primary": "var(--wick-border-radius-primary)",
        "wick-secondary": "var(--wick-border-radius-secondary)",
      },
      boxShadow: {
        wick: "var(--wick-box-shadow)",
      },
      fontFamily: {
        nunito: ["Nunito Sans", "sans-serif"],
      },
      keyframes: {
        "outliner-dropdown-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(90deg)" },
        },
        "outliner-expand": {
          "0%": { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        "outliner-dropdown-rotate": "outliner-dropdown-rotate 75ms ease-in forwards",
        "outliner-expand": "outliner-expand 75ms ease-in forwards",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("has-hover", "body.hasHover &:hover");
    }),
  ],
};
