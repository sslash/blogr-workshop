'use strict';

var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var config = require('./webpack.config');

module.exports = Object.assign(config, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
              'NODE_ENV': JSON.stringify('production'),
              'BABEL_ENV': JSON.stringify('production')
            }
        })
    ]
});