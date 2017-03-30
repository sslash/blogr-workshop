var config = require('./config.defaults');

config.db.host = 'development.postgres.service.consul';
config.db.user = 'blogr';
config.db.password = 'password1';

module.exports = config;
