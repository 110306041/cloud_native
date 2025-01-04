"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("TestCase", "Input", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.changeColumn("TestCase", "Output", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
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
