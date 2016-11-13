'use strict';
var config = require('./webpack.config');
module.exports = Object.assign(config, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
              'NODE_ENV': JSON.stringify('development'),
              'BABEL_ENV': JSON.stringify('development')
            }
        })
    ]
});