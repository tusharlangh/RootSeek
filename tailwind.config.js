
module.exports = {
  darkMode: "class",
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust to your file locations
  ],
  theme: {
    extend: {
      colors: {
        "text": "var(--text)",
        "background": "var(--background)",
        "primary": "var(--primary)",
        "secondary": "var(--secondary)",
        "accent": "var(--accent)",
      }
    },
  },
  plugins: [],
}
