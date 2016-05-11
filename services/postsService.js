var postsDAO = require('../dao/postsDAO');

function getAll () {
    return postsDAO.getAll();
}

function getPost (id) {
    return postsDAO.getPost(id);
}

function deletePost (id) {
    return postsDAO.deletePost(id);
}

function createPost (data) {
    return postsDAO.createPost(data)
}

module.exports = {
    getAll,
    getPost,
    deletePost,
    createPost
}
