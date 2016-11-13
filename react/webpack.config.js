'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        path.join(__dirname, 'src/main.js')
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'client.js'
    },
    plugins: [ ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ["react", "es2015", "stage-0"]
                }
            }, {

                  test: /\.json?$/,
                  loader: 'json'
            }, {
                  test: /\.css$/,
                  loader: 'style!css'
            }
        ]
    }
};