"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("TestCase", "Input", "Input_backup");
    await queryInterface.renameColumn("TestCase", "Output", "Output_backup");

    await queryInterface.addColumn("TestCase", "Input", {
      type: Sequelize.ARRAY(Sequelize.JSON),
      allowNull: false,
      defaultValue: [],
    });

    await queryInterface.addColumn("TestCase", "Output", {
      type: Sequelize.ARRAY(Sequelize.JSON),
      allowNull: false,
      defaultValue: [],
    });

    await queryInterface.sequelize.query(`
      UPDATE "TestCase"
      SET "Input" = ARRAY[TO_JSON("Input_backup")]::json[],
          "Output" = ARRAY[TO_JSON("Output_backup")]::json[]
      WHERE "Input_backup" IS NOT NULL AND "Output_backup" IS NOT NULL;
    `);

    await queryInterface.removeColumn("TestCase", "Input_backup");
    await queryInterface.removeColumn("TestCase", "Output_backup");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("TestCase", "Input_backup", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("TestCase", "Output_backup", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE "TestCase"
      SET "Input_backup" = (
        SELECT ARRAY_TO_STRING(ARRAY(SELECT jsonb_array_elements_text("Input")), ',')
      ),
          "Output_backup" = (
        SELECT ARRAY_TO_STRING(ARRAY(SELECT jsonb_array_elements_text("Output")), ',')
      )
      WHERE "Input" IS NOT NULL AND "Output" IS NOT NULL;
    `);

    await queryInterface.removeColumn("TestCase", "Input");
    await queryInterface.removeColumn("TestCase", "Output");

    await queryInterface.renameColumn("TestCase", "Input_backup", "Input");
    await queryInterface.renameColumn("TestCase", "Output_backup", "Output");
  },
};
