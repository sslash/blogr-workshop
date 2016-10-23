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
        path: path.join(__dirname, '..', 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
    ],
    devServer: {
         port: 3001,
         contentBase: '/',
         historyApiFallback: true,
         proxy: {
           '/api': {
             target: 'http://127.0.0.1:3000'
           }
         }
     },
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