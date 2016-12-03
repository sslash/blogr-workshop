var express = require('express');
var postsService = require('../services/postsService');
var router = express.Router();
var Umzug = require('umzug');
var umzug = new Umzug(require('../config/umzug'));

const info = {
  version: __VERSION__,
  hash: __HASH__,
  build_number: __BUILD_NUMBER__,
  build_tag: __BUILD_TAG__,
}

let migrations = [];
umzug.executed().then(function (m) {
  migrations = m.map(e => e.file );
});

router.get('/system/ping', function(req, res, next) {
    res.json({pong: true});
});

router.get('/system/info', function(req, res, next) {
    res.json(Object.assign({}, info, process.env, { migrations: migrations }));
});

module.exports = router;
