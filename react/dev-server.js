/* eslint no-console: 0 */

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const proxy = require('http-proxy-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');

const port = 3001;
const app = express();

const compiler = webpack(config);
const middleware = webpackMiddleware(compiler, {
    publicPath: '/',
    contentBase: '/',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
});
app.use(middleware);
app.use(webpackHotMiddleware(compiler));

app.use('*', proxy({target: 'http://localhost:3000'}));

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});