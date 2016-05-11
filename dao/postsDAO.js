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
        if (results.length) {
            return results;
        }
        return Promise.reject({message: `Blogg with Id: ${id} not found`, code: 404});

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
        console.log('Failed to delete post', error);
        throw error;
    });
}

function createPost (data) {
    return pg.query("INSERT INTO posts(title, owner, body) VALUES(${title}, ${owner}, ${body})", data)
    .then((results) => {
        return true;
    })
    .catch((error) => {
        console.log('Failed to create post', error);
        throw error;
    });
}

module.exports = {
    getAll,
    getPost,
    deletePost,
    createPost
};
