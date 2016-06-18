var pgp = require('pg-promise')(/*options*/);
var cn = {
    port: 5432,
    host: "db-1.dragon.lan",
    database: "blogr",
    user: "blogr",
    password: "password1"
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
