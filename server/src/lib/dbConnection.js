var pgp = require('pg-promise')(/*options*/);
var config = require('../config')
var debug = require('debug')('server');
var db = pgp(config.db);

function pingPostgres() {
    debug('Ping postgres.');

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

function migrateDb() {
    debug('Migrate database');
    umzug.up().then(function (migrations) {
       migrations.forEach(function(e) {
        debug(`Run migration ${e.file}`);
       });
    });
}

module.exports = {
    migrateDb,
    pingPostgres
    db
}
