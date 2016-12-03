var pgp = require('pg-promise')(/*options*/);
var config = require('../config')
var debug = require('debug')('server');
var db = pgp(config.db);

function pingPostgres() {
    // ping service
    db.query(`SELECT 'DBD::Pg ping test'`)
    .then(() => {
        debug('Postgres is running!');
    })
    .catch((err) => {
        debug('Failed to connect to postgres ', err);
        throw err;
    });
}

module.exports = {
    pingPostgres: pingPostgres,
    db: db
}
