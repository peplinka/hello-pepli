// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      // 👇 Обработка TypeScript
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      // Для JavaScript и JSX
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              ['@babel/preset-react', { runtime: 'automatic' }]
            ],
          },
        },
      },
      // Для CSS (с Tailwind и PostCSS)
      {
        test: /\.css$/i,
        use: [ // ✅ Только ОДНО правило для CSS
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1, // ВАЖНО: указывает, что после css-loader будет postcss-loader
            },
          },
          'postcss-loader', // ✅ Обрабатывает @tailwind, @apply
        ],
      },
      // ❌ УДАЛЕНО: Второе правило для .css
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', ".ts", ".tsx"],
    alias: {
      // Говорим, что @ заменяется на полный путь к директории ./src/
      "@": path.join(__dirname, "src"), // используем resolve
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // используем resolve
    }),
  ],
  devServer: {
    static: './public',
    port: 8081,
    open: true,
    hot: true,
    historyApiFallback: true,
  },
  mode: 'development',
};