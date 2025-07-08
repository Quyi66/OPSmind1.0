const { TRUE } = require('sass');
const makeWebpackConfig = require('./make-webpack-config');
const path = require('path');

const config = makeWebpackConfig({
  devServer: true,
  // devtool: 'inline-source-map',
  devtool: 'eval',
  debug: true,
});

// config.watch = false;
config.watchOptions = {
  ignored: /node_modules/,
  aggregateTimeout: 5000,
  poll: 5000
}

config.devServer = {
  contentBase: path.join(__dirname, 'dist'),
  port: 2992,
  hot: false,
  hotOnly: false,
  disableHostCheck: true,
  publicPath: 'http://oplus-dev/oplus/base/app/modules/flow/dist/',
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 5000,
    poll: 5000
  },
  stats: Object.assign({
    colors: true
  }, config.devServer.stats),
  writeToDisk: (filePath) => {
    // return true;
    return /oplus-flow\.[js|js\.map]/.test(filePath);
  },
};

// config.serve = {
//   devMiddleware: {
//     port: 2992,
//     compress: false,
//     liveReload: false,
//     hot: false,
//     watch: true,
//     watchOptions: {
//       //不监听的文件或者文件夹，支持正则匹配
//       //默认为空
//       ignored: /node_modules/,
//       //监听到变化发生后会等300ms再去执行动作，防止文件更新太快
//       //默认为300ms
//       aggregateTimeout: 5000,
//       //判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的
//       poll: 1000
//     },
//     headers: {
//       'Access-Control-Allow-Origin': '*'
//     },
//     writeToDisk: (filePath) => {
//       return /oplus-flow\.[js|js\.map]/.test(filePath);
//     },
//     publicPath: './',
//     stats: Object.assign({
//       colors: true
//     }, config.devServer.stats),
//   },
//   clipboard: false,
// };

module.exports = config;
