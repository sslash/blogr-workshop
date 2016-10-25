'use strict';

var path = require('path');
var webpack = require('webpack');
var config = require('./webpack.config');

module.exports = Object.assign(config, {
    devtool: 'eval-source-map',
    entry: [
        'webpack-hot-middleware/client?reload=true',
    ],
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
    ],
    devServer: {
         port: 3001,
         contentBase: '/',
         historyApiFallback: true,
         proxy: {
           '/api': {
             target: 'http://127.0.0.1:3000'
           }
         }
     }
});