'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Rename the existing columns (backup old data)
    await queryInterface.renameColumn('TestCase', 'Input', 'Input_backup');
    await queryInterface.renameColumn('TestCase', 'Output', 'Output_backup');

    // 2. Add new columns with the desired type
    await queryInterface.addColumn('TestCase', 'Input', {
      type: Sequelize.ARRAY(Sequelize.JSON),
      allowNull: false,
      defaultValue: [], // Set a default empty array
    });

    await queryInterface.addColumn('TestCase', 'Output', {
      type: Sequelize.ARRAY(Sequelize.JSON),
      allowNull: false,
      defaultValue: [], // Set a default empty array
    });

    // 3. Migrate data to the new columns
    await queryInterface.sequelize.query(`
      UPDATE "TestCase"
      SET "Input" = ARRAY[TO_JSON("Input_backup")]::json[],
          "Output" = ARRAY[TO_JSON("Output_backup")]::json[]
      WHERE "Input_backup" IS NOT NULL AND "Output_backup" IS NOT NULL;
    `);

    // 4. Remove the backup columns
    await queryInterface.removeColumn('TestCase', 'Input_backup');
    await queryInterface.removeColumn('TestCase', 'Output_backup');
  },

  down: async (queryInterface, Sequelize) => {
    // 1. Add backup columns with TEXT type
    await queryInterface.addColumn('TestCase', 'Input_backup', {
      type: Sequelize.TEXT,
      allowNull: true, // Allow NULL temporarily
    });

    await queryInterface.addColumn('TestCase', 'Output_backup', {
      type: Sequelize.TEXT,
      allowNull: true, // Allow NULL temporarily
    });

    // 2. Migrate data back to TEXT format (reverse the transformation)
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

    // 3. Remove the JSON[] columns
    await queryInterface.removeColumn('TestCase', 'Input');
    await queryInterface.removeColumn('TestCase', 'Output');

    // 4. Rename backup columns back to original names
    await queryInterface.renameColumn('TestCase', 'Input_backup', 'Input');
    await queryInterface.renameColumn('TestCase', 'Output_backup', 'Output');
  },
};
