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
 * http://docs.sequelizejs.com/en/latest/docs/raw-queries/
 * https://github.com/sequelize/cli
 */
module.exports = {
  up: function (queryInterface, Sequelize) {
    const SQL = `create table IF NOT EXISTS posts (
        id serial primary key,
        title varchar(50) not null default '',
        owner varchar(30) not null default '',
        body varchar(1000) not null default '',
        created timestamptz not null default now(),
        updated timestamptz not null default now()
    );`;

    return queryInterface.sequelize.query(SQL,
        { type: Sequelize.QueryTypes.RAW });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('posts');
  }
};


