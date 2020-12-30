const path = require('path')
module.exports = {
  entry: './src/index.js' /*需要打包的入口文件*/,
  output: {
    filename: 'bundle.js' /*打包输出文件的名称*/,
    path: path.resolve(__dirname, 'dist') /*打包输出文件的目录*/,
  },
}
