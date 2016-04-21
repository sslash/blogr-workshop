var postsDAO = require('../dao/postsDAO');

function getAll () {
    return postsDAO.getAll();
}

function getPost (id) {
    return postsDAO.getPost(id);
}

function deletePost (id) {
    console.log('#### delete should be called for Post '+id);
    return postsDAO.deletePost(id);
}


module.exports = {
    getAll: getAll,
    getPost: getPost,
    deletePost: deletePost
};
