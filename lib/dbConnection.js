var pgp = require('pg-promise')(/*options*/);
var config = require('../config')

console.log(config);

var db = pgp(config.db);

function pingPostgres() {
    // ping service
    db.query(`SELECT 'DBD::Pg ping test'`)
    .then(() => {
        console.log('Postgres is running!');
    })
    .catch((err) => {
        console.log('Failed to connect to postgres ', err);
        throw err;
    });
}

module.exports = {
    pingPostgres: pingPostgres,
    db: db
}
