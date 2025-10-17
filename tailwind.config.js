/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#ff00ff',
          blue: '#00ffff',
          green: '#00ff00',
          purple: '#bf00ff',
        },
      },
      boxShadow: {
        'neon-pink': '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff',
        'neon-blue': '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
        'neon-green': '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00',
        'neon-purple': '0 0 10px #bf00ff, 0 0 20px #bf00ff, 0 0 30px #bf00ff',
      },
    },
  },
  plugins: [],
}
