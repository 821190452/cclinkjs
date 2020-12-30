const path = require('path')
const packagejson = require('./package.json')

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  target: 'node',
  output: {
    filename: `cclink-${packagejson.version}.js`,
    path: path.resolve(__dirname, 'dist'),
  },
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
    setImmediate: true,
  },
}
