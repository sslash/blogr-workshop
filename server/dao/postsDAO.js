var pg = require('../lib/dbConnection').db;

function getAll () {
    return pg.query('SELECT * FROM posts')
    .then((results) => {
        return results;
    })
    .catch((error) => {
        console.log('Failed to get all posts', error);
        throw error;
    });
}

function getPost (id) {
    return pg.query('SELECT * FROM posts where id='+id)
    .then((results) => {
        return results;
    })
    .catch((error) => {
        console.log('Failed to get post', error);
        throw error;
    });
}

function deletePost (id) {
    return pg.query('delete from posts where id='+id)
    .then((results) => {
        return results;
    })
    .catch((error) => {
        console.log('Failed to get post', error);
        throw error;
    });
}

module.exports = {
    getAll: getAll,
    getPost: getPost,
    deletePost: deletePost
};
