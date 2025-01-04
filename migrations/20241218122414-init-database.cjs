"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create User table
    await queryInterface.createTable("User", {
      ID: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      Type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      Name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      Email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      Password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    });

    // Create Course table
    await queryInterface.createTable("Course", {
      ID: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      Name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      Semester: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      StudentCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      StudentLimit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });

    // Create Assignment table
    await queryInterface.createTable("Assignment", {
      ID: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      Name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      DueDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      Description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      CourseID: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Course",
          key: "ID",
        },
        onDelete: "CASCADE",
      },
    });

    // Create UserCourse table
    await queryInterface.createTable("UserCourse", {
      ID: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      UserID: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "User",
          key: "ID",
        },
        onDelete: "CASCADE",
      },
      CourseID: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Course",
          key: "ID",
        },
        onDelete: "CASCADE",
      },
    });

    // Create Exam table
    await queryInterface.createTable("Exam", {
      ID: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      Name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      StartDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      DueDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      Description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      CourseID: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Course",
          key: "ID",
        },
        onDelete: "CASCADE",
      },
    });

    // Create Question table
    await queryInterface.createTable("Question", {
      ID: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      Name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      Description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      TimeLimit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      MemoryLimit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Difficulty: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      Constraints: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      SampleTestCase: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      SubmissionLimit: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      AssignmentID: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Assignment",
          key: "ID",
        },
        onDelete: "CASCADE",
      },
      ExamID: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Exam",
          key: "ID",
        },
        onDelete: "CASCADE",
      },
    });

    // Create TestCase table
    await queryInterface.createTable("TestCase", {
      ID: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      Input: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      Output: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      Sequence: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      QuestionID: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Question",
          key: "ID",
        },
        onDelete: "CASCADE",
      },
    });

    // Create Submission table
    await queryInterface.createTable("Submission", {
      ID: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      Score: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      TimeSpend: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      MemoryUsage: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      CreatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      Code: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      Language: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      UserID: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "User",
          key: "ID",
        },
        onDelete: "CASCADE",
      },
      QuestionID: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Question",
          key: "ID",
        },
        onDelete: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop tables in reverse order to respect foreign key constraints
    await queryInterface.dropTable("Submission");
    await queryInterface.dropTable("TestCase");
    await queryInterface.dropTable("Question");
    await queryInterface.dropTable("Exam");
    await queryInterface.dropTable("UserCourse");
    await queryInterface.dropTable("Assignment");
    await queryInterface.dropTable("Course");
    await queryInterface.dropTable("User");
  },
};
