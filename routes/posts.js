var express = require('express');
var postsService = require('../services/postsService');
var router = express.Router();

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

router.post('/', (req, res, next) => {
    const {body} = req;
    postsService.createPost(body)
    .then((result) => {
        res.send(200);
    })
    .catch((error) => {
        next(error);
    });
});
router.get('/:id', (req, res, next) => {
    const {id} = req.params;
    postsService.getPost(id)
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

router.delete('/:id', (req, res, next) => {
    const {id} = req.params;
    postsService.getPost(id)
    .then((result) => {
        return postsService.deletePost(result[0].id);
    })
    .then((result) => {
        res.send(204);
    })
    .catch((error) => {
        next(error);
    });
});

module.exports = router;
