var config = module.exports = {};
config.env = process.env.NODE_ENV || 'dev';

var db = {
    database: "blogr",
    port: 5432,
}

config.db = db;