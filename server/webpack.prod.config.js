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

console.info("Build with environment for production");
console.info("BABEL_ENV", process.env.BABEL_ENV);
console.info("NODE_ENV", process.env.NODE_ENV);
console.info("HASH", commitHash);
console.info("VERSION", versionFromPackage);
console.info("BUILD", process.env.BUILD);

module.exports = Object.assign(config, {
    plugins: [
        new webpack.DefinePlugin({
            '__VERSION__': JSON.stringify(versionFromPackage),
            '__HASH__': JSON.stringify(commitHash),
            '__BUILD__': JSON.stringify(process.env.BUILD),
            'process.env': {
              'NODE_ENV': JSON.stringify('production'),
              'BABEL_ENV': JSON.stringify('production')
            }
        })
    ]
});