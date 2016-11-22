/*eslint-disable no-var*/
'use strict';

exports.config = {
  specs: ['./test/e2e/**/*.spec.js'],
  capabilities: {
      browserName: 'phantomjs',
      'phantomjs.binary.path': require('phantomjs-prebuilt').path,
      'phantomjs.cli.args': ['--web-security=false', '--ignore-ssl-errors=true', '--webdriver-loglevel=DEBUG'],
  },
  baseUrl: 'http://localhost:3000',
  framework: 'mocha',
  onPrepare: function() {
    browser.ignoreSynchronization = true;
    require('babel-core/register');
  },
  mochaOpts: {
    reporter: "spec",
  }
};