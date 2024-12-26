'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Rename columns in User table
    await queryInterface.renameColumn('User', 'id', 'IDD');
    await queryInterface.renameColumn('User', 'type', 'Type');
    await queryInterface.renameColumn('User', 'name', 'Name');
    await queryInterface.renameColumn('User', 'email', 'Email');
    await queryInterface.renameColumn('User', 'password', 'Password');

    // Rename columns in Course table
    await queryInterface.renameColumn('Course', 'id', 'ID');
    await queryInterface.renameColumn('Course', 'name', 'Name');
    await queryInterface.renameColumn('Course', 'semester', 'Semester');
    await queryInterface.renameColumn('Course', 'studentcount', 'StudentCount');
    await queryInterface.renameColumn('Course', 'studentlimit', 'StudentLimit');

    // Rename columns in Assignment table
    await queryInterface.renameColumn('Assignment', 'id', 'ID');
    await queryInterface.renameColumn('Assignment', 'name', 'Name');
    await queryInterface.renameColumn('Assignment', 'duedate', 'DueDate');
    await queryInterface.renameColumn('Assignment', 'description', 'Description');
    await queryInterface.renameColumn('Assignment', 'courseid', 'CourseID');

    // Rename columns in UserCourse table
    await queryInterface.renameColumn('UserCourse', 'id', 'ID');
    await queryInterface.renameColumn('UserCourse', 'userid', 'UserID');
    await queryInterface.renameColumn('UserCourse', 'courseid', 'CourseID');

    // Rename columns in Exam table
    await queryInterface.renameColumn('Exam', 'id', 'ID');
    await queryInterface.renameColumn('Exam', 'name', 'Name');
    await queryInterface.renameColumn('Exam', 'startdate', 'StartDate');
    await queryInterface.renameColumn('Exam', 'duedate', 'DueDate');
    await queryInterface.renameColumn('Exam', 'description', 'Description');
    await queryInterface.renameColumn('Exam', 'courseid', 'CourseID');

    // Rename columns in Question table
    await queryInterface.renameColumn('Question', 'id', 'ID');
    await queryInterface.renameColumn('Question', 'name', 'Name');
    await queryInterface.renameColumn('Question', 'description', 'Description');
    await queryInterface.renameColumn('Question', 'timelimit', 'TimeLimit');
    await queryInterface.renameColumn('Question', 'memorylimit', 'MemoryLimit');
    await queryInterface.renameColumn('Question', 'difficulty', 'Difficulty');
    await queryInterface.renameColumn('Question', 'constraints', 'Constraints');
    await queryInterface.renameColumn('Question', 'sampletestcase', 'SampleTestCase');
    await queryInterface.renameColumn('Question', 'submissionlimit', 'SubmissionLimit');
    await queryInterface.renameColumn('Question', 'assignmentid', 'AssignmentID');
    await queryInterface.renameColumn('Question', 'examid', 'ExamID');

    // Rename columns in TestCase table
    await queryInterface.renameColumn('TestCase', 'id', 'ID');
    await queryInterface.renameColumn('TestCase', 'input', 'Input');
    await queryInterface.renameColumn('TestCase', 'output', 'Output');
    await queryInterface.renameColumn('TestCase', 'sequence', 'Sequence');
    await queryInterface.renameColumn('TestCase', 'questionid', 'QuestionID');

    // Rename columns in Submission table
    await queryInterface.renameColumn('Submission', 'id', 'ID');
    await queryInterface.renameColumn('Submission', 'score', 'Score');
    await queryInterface.renameColumn('Submission', 'timespend', 'TimeSpend');
    await queryInterface.renameColumn('Submission', 'memoryusage', 'MemoryUsage');
    await queryInterface.renameColumn('Submission', 'createdat', 'CreatedAt');
    await queryInterface.renameColumn('Submission', 'code', 'Code');
    await queryInterface.renameColumn('Submission', 'language', 'Language');
    await queryInterface.renameColumn('Submission', 'userid', 'UserId');
    await queryInterface.renameColumn('Submission', 'questionid', 'QuestionId');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
