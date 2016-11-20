'use strict';

var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var config = require('./webpack.config');

// get git info from command line
var commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString().replace('\n','');

var versionFromPackage = require("./package.json").version;

module.exports = Object.assign(config, {
    plugins: [
        new webpack.DefinePlugin({
            '__VERSION__': JSON.stringify(versionFromPackage),
            '__HASH__': JSON.stringify(commitHash),
            '__BUILD_NUMBER__': JSON.stringify(process.env.BUILD_NUMBER),
            '__BUILD_TAG__': JSON.stringify(process.env.BUILD_TAG),
            'process.env': {
              'NODE_ENV': JSON.stringify('production'),
              'BABEL_ENV': JSON.stringify('production')
            }
        })
    ]
});