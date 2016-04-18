var postsDAO = require('../dao/postsDAO');

function getAll () {
    return postsDAO.getAll();
}


module.exports = {
    getAll: getAll
};
