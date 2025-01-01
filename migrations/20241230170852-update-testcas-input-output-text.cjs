"use strict";

module.exports = {
  // Up: change 'Input' and 'Output' columns to TEXT
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("TestCase", "Input", {
      type: Sequelize.TEXT,
      allowNull: true,  // or false, depending on your requirement
    });

    await queryInterface.changeColumn("TestCase", "Output", {
      type: Sequelize.TEXT,
      allowNull: true,  // or false, depending on your requirement
    });
  },

  // Down: revert them to their original type (JSON, ARRAY, etc.)
  down: async (queryInterface, Sequelize) => {
    // If your original columns were JSON (Postgres example):
    await queryInterface.changeColumn("TestCase", "Input", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.changeColumn("TestCase", "Output", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },
};
