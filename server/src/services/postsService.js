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

module.exports = {
    getAll: getAll,
    getPost: getPost,
    deletePost: deletePost
};
