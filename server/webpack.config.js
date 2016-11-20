'use strict';

var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
    target: "node",
    devtool: 'eval-source-map',
    entry: [
        path.join(__dirname, 'server.js')
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'server.js'
    },
    externals: nodeModules,
    module: {
        preLoaders: [
            { test: /\.json$/, loader: 'json'},
        ],
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ["es2015", "stage-0"]
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
              'NODE_ENV': JSON.stringify('development'),
              'BABEL_ENV': JSON.stringify('development')
            }
        })
    ]
};