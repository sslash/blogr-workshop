var express = require('express');
var postsService = require('../services/postsService');
var router = express.Router();

/* GET posts listing. */
router.get('/posts/', function(req, res, next) {
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

router.get('/posts/:id', (req, res, next) => {
    var id = req.params.id;
    console.log('route id: '+id);
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

router.delete('/posts/:id', (req, res, next) => {
    var id = req.params.id;
    postsService.getPost(id)
    .then((result) => {
          throw new Error("Post does not exist");
          postsService.deletePost(result[0].id);
          return result;
    })
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


module.exports = router;
