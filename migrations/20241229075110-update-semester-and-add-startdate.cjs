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
      allowNull: false,
      defaultValue: "Unknown",
    });
    await queryInterface.sequelize.query(`
      UPDATE "Course"
      SET "semester_temp" = CAST("Semester" AS TEXT)
    `);
    await queryInterface.removeColumn("Course", "Semester");
    await queryInterface.renameColumn("Course", "semester_temp", "Semester");
    await queryInterface.addColumn("Assignment", "StartDate", {
      type: Sequelize.DATE,
      allowNull: true,
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
      defaultValue: 0,
    });

    await queryInterface.sequelize.query(`
      UPDATE "Course"
      SET "semester_temp" = CAST("Semester" AS INTEGER)
    `);

    await queryInterface.removeColumn("Course", "Semester");

    await queryInterface.renameColumn("Course", "semester_temp", "Semester");

    await queryInterface.removeColumn("Assignment", "StartDate");
  },
};
