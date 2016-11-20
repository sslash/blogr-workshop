var express = require('express');
var postsService = require('../services/postsService');
var router = express.Router();

const info = {
  version: __VERSION__,
  hash: __HASH__,
  build_number: __BUILD_NUMBER__,
  build_tag: __BUILD_TAG__
}

router.get('/system/ping', function(req, res, next) {
    res.json({pong: true});
});

router.get('/system/info', function(req, res, next) {
    res.json(Object.assign({}, info, process.env));
});

module.exports = router;
