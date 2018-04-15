const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'assets/src/js/app.js'),
  output: {
    path: path.resolve(__dirname, 'assets/dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: path.resolve(__dirname, 'assets/src/js')  // /\.js$/
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'assets/dist')
  }
}