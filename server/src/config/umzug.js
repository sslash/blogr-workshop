var config = require("./index");
var debug = require('debug')('server');
var Sequelize = require("sequelize");

var sequelizeInstance = new Sequelize(config.db.user, config.db.user, config.db.password, {
    dialect: 'postgres',
    logging: debug,
});

module.exports = {
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelizeInstance,
  },
};