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

module.exports = {
    getAll: getAll
};
