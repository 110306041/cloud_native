'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('User', 'IDD', 'ID');
    await queryInterface.renameColumn('Submission', 'UserID', 'UserIDD');
    await queryInterface.renameColumn('Submission', 'QuestionID', 'QuestionIDD');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.renameColumn('Submission', 'UserID', 'UserId');
    await queryInterface.renameColumn('Submission', 'QuestionID', 'QuestionId');
  }
};
