'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'eval-source-map',
    entry: [
        'webpack-hot-middleware/client?reload=true',
        path.join(__dirname, 'frontend/main.js')
    ],
    output: {
        path: __dirname,
        publicPath: '/',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ["react", "es2015", "stage-0", "react-hmre"]
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