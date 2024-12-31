'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the 'InputBackup' and 'OutputBackup' columns
    await queryInterface.removeColumn('TestCase', 'Input_backup');
    await queryInterface.removeColumn('TestCase', 'Output_backup');
  },

  async down(queryInterface, Sequelize) {
    // Add the 'InputBackup' and 'OutputBackup' columns back
    await queryInterface.addColumn('TestCase', 'Input_backup', {
      type: Sequelize.TEXT, // Adjust type if needed
      allowNull: true,      // Change to false if required
    });

    await queryInterface.addColumn('TestCase', 'Output_backup', {
      type: Sequelize.TEXT, // Adjust type if needed
      allowNull: true,      // Change to false if required
    });
  },
};
