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
      // 👇 НОВОЕ: обработка TypeScript
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
      // 👇 НОВОЕ: обработка CSS-модулей (важно: до обычного CSS)
      {
        test: /\.module\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]', // Опционально: настройка имён классов
              },
            },
          },
        ],
      },
      // Для обычных CSS файлов (должно идти ПОСЛЕ .module.css)
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', ".ts", ".tsx"],
    alias: {
      // Говорим, что @ заменяется на полный путь к директории ./src/
      "@": path.join(__dirname, "src"),
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
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