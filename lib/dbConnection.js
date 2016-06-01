var pgp = require('pg-promise')(/*options*/);
var cn = {
    host: '10.0.1.203', // server name or IP address;
    port: 5432,
    database: 'blogr',
    user:'postgres',
    password:'Password1'
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
