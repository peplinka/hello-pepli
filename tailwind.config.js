// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{html,js}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Основные цвета клиники
        'hospital-primary': '#006b7d',     // Глубокий бирюзовый (доверие, спокойствие)
        'hospital-secondary': '#e3f2fd',   // Светло-голубой фон
        'hospital-accent': '#ff6b35',      // Тёплый оранжевый (действие, энергия)
        'hospital-dark': '#2c3e50',        // Тёмный сине-серый (текст)
        'hospital-light': '#ffffff',       // Белый
        'hospital-success': '#4caf50',     // Зелёный (здоровье)
        'hospital-warning': '#ffc107',     // Жёлтый
        'hospital-danger': '#f44336',      // Красный
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'container': '1080px',
      }
    },
  },
  plugins: [],
}