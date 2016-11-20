'use strict';

var path = require('path');
var webpack = require('webpack');
var config = require('./webpack.config');

const plugins = config.plugins;
plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production'),
      'BABEL_ENV': JSON.stringify('production')
    }
}));

module.exports = config;