'use strict';

/**
 * Create posts table
 * with columns
 *  - id
 *  - title
 *  - owner
 *  - body
 *  - created
 *  - updated
 *
 * http://docs.sequelizejs.com/en/latest/docs/models-definition/
 */
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('posts',
        {
            id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true
            },
            created: {
              type: Sequelize.DATE,
              defaultValue: Sequelize.NOW,
              allowNull: false
            },
            updated: {
              type: Sequelize.DATE,
              defaultValue: Sequelize.NOW,
              allowNull: false
            },
            owner: {
             type: Sequelize.STRING,
             allowNull: false
            },
            title: {
             type: Sequelize.TEXT,
             allowNull: false
            },
            body: {
             type: Sequelize.TEXT,
             allowNull: false
            }
        }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('posts');
  }
};


