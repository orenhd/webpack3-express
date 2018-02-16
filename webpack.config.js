const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
.filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });
  
module.exports = {
  entry: './src/main.js',
  target: 'node',
  node: {
        __dirname: false
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'build'),
	publicPath: '/build/'
  },
  module: {
        rules: [
			{
			  test: /\.js$/,
			  exclude: /node_modules/,
			  use: {
				loader: 'babel-loader',
				options: {
				  presets: ['env']
				}
			  }
    }
			]
  },
  externals: nodeModules,
  plugins: [
    new webpack.BannerPlugin({banner: 'require("source-map-support").install();', raw: true, entryOnly: false})
  ],
  devtool: 'sourcemap'
};