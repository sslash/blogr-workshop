'use strict';

var path = require('path');
var webpack = require('webpack');
var config = require('./webpack.config');

module.exports = Object.assign(config, {
    devtool: 'eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
    ],
    plugins: [
        // Webpack 1.0
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
              'NODE_ENV': JSON.stringify('production'),
              'BABEL_ENV': JSON.stringify('production')
            }
        })
    ]
});