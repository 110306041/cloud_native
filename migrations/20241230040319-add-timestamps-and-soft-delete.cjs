'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the columns to each table
    await queryInterface.addColumn('User', 'CreatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('User', 'UpdatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('User', 'DeletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Course', 'CreatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('Course', 'UpdatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('Course', 'DeletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('UserCourse', 'CreatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('UserCourse', 'UpdatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('UserCourse', 'DeletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Assignment', 'CreatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('Assignment', 'UpdatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('Assignment', 'DeletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Exam', 'CreatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('Exam', 'UpdatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('Exam', 'DeletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Question', 'CreatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('Question', 'UpdatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('Question', 'DeletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('TestCase', 'CreatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('TestCase', 'UpdatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('TestCase', 'DeletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the columns from each table
    await queryInterface.removeColumn('User', 'CreatedAt');
    await queryInterface.removeColumn('User', 'UpdatedAt');
    await queryInterface.removeColumn('User', 'DeletedAt');

    await queryInterface.removeColumn('Course', 'CreatedAt');
    await queryInterface.removeColumn('Course', 'UpdatedAt');
    await queryInterface.removeColumn('Course', 'DeletedAt');

    await queryInterface.removeColumn('UserCourse', 'CreatedAt');
    await queryInterface.removeColumn('UserCourse', 'UpdatedAt');
    await queryInterface.removeColumn('UserCourse', 'DeletedAt');

    await queryInterface.removeColumn('Assignment', 'CreatedAt');
    await queryInterface.removeColumn('Assignment', 'UpdatedAt');
    await queryInterface.removeColumn('Assignment', 'DeletedAt');

    await queryInterface.removeColumn('Exam', 'CreatedAt');
    await queryInterface.removeColumn('Exam', 'UpdatedAt');
    await queryInterface.removeColumn('Exam', 'DeletedAt');

    await queryInterface.removeColumn('Question', 'CreatedAt');
    await queryInterface.removeColumn('Question', 'UpdatedAt');
    await queryInterface.removeColumn('Question', 'DeletedAt');

    await queryInterface.removeColumn('TestCase', 'CreatedAt');
    await queryInterface.removeColumn('TestCase', 'UpdatedAt');
    await queryInterface.removeColumn('TestCase', 'DeletedAt');
  },
};
