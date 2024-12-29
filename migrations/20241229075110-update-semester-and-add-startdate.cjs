"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    
    await queryInterface.addColumn("Course", "semester_temp", {
      type: Sequelize.STRING,
      allowNull: false, // Adjust as needed
      defaultValue: "Unknown", // Provide a sensible default if necessary
    });
    await queryInterface.sequelize.query(`
      UPDATE "Course"
      SET "semester_temp" = CAST("Semester" AS TEXT)
    `);
    await queryInterface.removeColumn("Course", "Semester");
    await queryInterface.renameColumn("Course", "semester_temp", "Semester");
    await queryInterface.addColumn("Assignment", "StartDate", {
      type: Sequelize.DATE,
      allowNull: true, // Adjust as needed
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn("Course", "semester_temp", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // Provide a default or handle existing rows
    });

    // Convert data back from `semester` (string) to `semester_temp` (integer)
    await queryInterface.sequelize.query(`
      UPDATE "Course"
      SET "semester_temp" = CAST("Semester" AS INTEGER)
    `);

    // Remove the `semester` column
    await queryInterface.removeColumn("Course", "Semester");

    // Rename `semester_temp` back to `semester`
    await queryInterface.renameColumn("Course", "semester_temp", "Semester");

    // Remove the `startDate` column
    await queryInterface.removeColumn("Assignment", "StartDate");
  },
};
