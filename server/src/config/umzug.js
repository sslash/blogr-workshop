var config = require("./index");
var debug = require('debug')('server');
var Sequelize = require("sequelize");

console.log("config", config);

var sequelizeInstance = new Sequelize(config.db.user, config.db.user, config.db.password, {
    dialect: 'postgres',
    logging: debug,
    host: config.db.host,
    port: 5432
});

module.exports = {
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelizeInstance,
  },
  migrations: {
    params: [sequelizeInstance.getQueryInterface(), Sequelize]
  }
};
