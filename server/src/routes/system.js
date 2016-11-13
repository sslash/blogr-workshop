var express = require('express');
var postsService = require('../services/postsService');
var router = express.Router();

router.get('/system/ping', function(req, res, next) {
    res.json({ok:true});
});

router.get('/system/info', function(req, res, next) {
});

module.exports = router;
