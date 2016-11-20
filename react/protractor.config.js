/*eslint-disable no-var*/
'use strict';

exports.config = {
  specs: ['./test/e2e/**/*.js'],
  capabilities: {
    browserName: 'chrome'
  },
  baseUrl: 'http://localhost:3000',
  frameworks: ['mocha', 'chai'],
  onPrepare: function() {
    browser.ignoreSynchronization = true;
    require('babel-core/register');
  }
};