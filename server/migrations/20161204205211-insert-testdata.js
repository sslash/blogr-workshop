'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query("INSERT INTO posts (owner, title, body) values (:owner, :title, :body)",
        { replacements: { owner: 'daniel', title:'en test', body:'blablabla' },
          type: Sequelize.QueryTypes.INSERT });
  },

  down: function (queryInterface, Sequelize) {
    return Promise.resolve();
  }
};
