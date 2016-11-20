var express = require('express');
var postsService = require('../services/postsService');
var router = express.Router();

const info = {
  version: __VERSION__,
  hash: __HASH__,
  build: __BUILD__
}

router.get('/system/ping', function(req, res, next) {
    res.json({pong: true});
});

router.get('/system/version', function(req, res, next) {
    res.json({version: info.version});
});

router.get('/system/hash', function(req, res, next) {
    res.json({hash: info.hash});
});

router.get('/system', function(req, res, next) {
    res.json(Object.assign({}, info, process.env));
});

module.exports = router;
