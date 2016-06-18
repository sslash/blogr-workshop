var pgp = require('pg-promise')(/*options*/);
var cn = {
    port: 5432,
    host: process.env.BLOGR_DB_HOST,
    database: process.env.BLOGR_DB_NAME,
    user: process.env.BLOGR_DB_USER,
    password: process.env.BLOGR_DB_PASSWORD
};
var db = pgp(cn);


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
