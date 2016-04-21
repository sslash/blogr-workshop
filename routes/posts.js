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

router.delete('/:id', (req, res, next) => {
    var id = req.params.id;
    postsService.getPost(id)
    .then((result) => {
          throw new Error("Post does not exist");
          console.log("##### ROUTE ID "+result[0].id);
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
