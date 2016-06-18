var config = {};

var pg = {
    database: "blogr",
    port: process.env.BLOGR_DB_PORT || 5432,
    host: process.env.BLOGR_DB_HOST || 'localhost',
    user: process.env.BLOGR_DB_USER || 'blogr',
    password: process.env.BLOGR_DB_PASSWORD || 'password1'
}
config.pg = pg;

module.exports = config;