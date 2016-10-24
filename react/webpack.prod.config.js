'use strict';

var path = require('path');
var webpack = require('webpack');
var config = require('./webpack.config');

module.exports = Object.assign(config, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
              'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
});