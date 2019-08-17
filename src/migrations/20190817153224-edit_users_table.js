'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'users',
        'api_token',
        {
          type: Sequelize.STRING,
          defaultValue: '1234',
          after: 'password'
        }
      ),
      queryInterface.addColumn(
        'users',
        'api_token_created_at',
        {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          after: 'api_token'
        }
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'api_token'),
      queryInterface.removeColumn('users', 'api_token_created_at')
    ]);
  }
};
