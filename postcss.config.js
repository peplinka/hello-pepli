// postcss.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/postcss')(), // ✅ Новый способ подключения
    require('autoprefixer'), // или 'autoprefixer': {}
  ],
}