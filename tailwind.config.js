/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#050b14',
        'glass': 'rgba(255, 255, 255, 0.03)',
        'glass-hover': 'rgba(255, 255, 255, 0.1)',
        'border': 'rgba(255, 255, 255, 0.1)',
        'border-hover': 'rgba(255, 255, 255, 0.3)',
        'neon-blue': '#00f2ff',
        'neon-purple': '#bd00ff',
        'neon-pink': '#ff0055',
        'neon-orange': '#ff9e00',
        'neon-green': '#10b981',
        'text-main': '#ffffff',
        'text-muted': '#94a3b8',
      },
      fontFamily: {
        head: ['Space Grotesk', 'Segoe UI', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 20s infinite alternate',
        'progress-glow': 'progressGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '100%': { transform: 'translate(30px, 20px) rotate(5deg)' },
        },
        progressGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
