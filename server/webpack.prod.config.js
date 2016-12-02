'use strict';

var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var config = require('./webpack.config');
var git = require('git-rev-sync');
var version = require('./package.json').version;

module.exports = Object.assign(config, {
    plugins: [
        new webpack.DefinePlugin({
            '__VERSION__': JSON.stringify(version),
            '__HASH__': JSON.stringify(git.short()),
            '__BUILD_NUMBER__': JSON.stringify(process.env.BUILD_NUMBER),
            '__BUILD_TAG__': JSON.stringify(process.env.BUILD_TAG),
            'process.env': {
              'NODE_ENV': JSON.stringify('production'),
              'BABEL_ENV': JSON.stringify('production')
            }
        })
    ]
});