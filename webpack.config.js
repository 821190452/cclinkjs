const path = require('path')
const packagejson = require('./package.json')

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  target: 'node',
  output: {
    filename: `cclink-${packagejson.version}.bundle.js`,
    path: path.resolve(__dirname, 'dist'),
  },
  node: {
    __filename: true,
    __dirname: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: '/node_modules/',
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: '/node_modules/',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
}
