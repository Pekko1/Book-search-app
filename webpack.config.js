const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Punto di ingresso
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Directory di output
    clean: true // Pulisce la cartella dist prima di ogni build
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Regola per i file CSS
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, // Regola per le immagini
        type: 'asset/resource'
      },
      {
        test: /\.js$/, // Regola per i file JS
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Percorso al file HTML di origine
      filename: 'index.html' // Nome del file HTML di destinazione
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist') // Directory servita dal dev server
    },
    open: true, // Apre il browser automaticamente
    hot: true, // Hot reloading
    watchFiles: ['src/**/*'] // Monitorare i file nella cartella src
  }
};
