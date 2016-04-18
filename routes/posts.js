var express = require('express');
var postsService = require('../services/postsService');
var router = express.Router();

/* GET posts listing. */
router.get('/', function(req, res, next) {
    postsService.getAll()
    .then((result) => {
        res.json({
            data: result,
            blogs: result.length
        });
    })
    .catch((error) => {
        next(error);
    });
});

router.get('/:id', (req, res, next) => {
    // TODO
});

module.exports = router;
