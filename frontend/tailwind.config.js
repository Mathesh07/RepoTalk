/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0b0b10',
          soft: '#0f1117'
        },
        accent: {
          DEFAULT: '#7c3aed',
          blue: '#3b82f6',
        }
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(0,0,0,0.5)'
      },
      backgroundImage: {
        'grid': "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
        'glow': 'radial-gradient(600px 200px at 50% 0%, rgba(124,58,237,0.15), transparent)'
      }
    }
  },
  plugins: []
}
