import User from "./User.js";
import Course from "./Course.js";
import Assignment from "./Assignment.js";
import UserCourse from "./UserCourse.js";
import Exam from "./Exam.js";
import Question from "./Question.js";
import TestCase from "./TestCase.js";
import Submission from "./Submission.js";

User.hasMany(UserCourse, { foreignKey: "UserID", onDelete: "CASCADE" });
UserCourse.belongsTo(User, { foreignKey: "UserID" });

Course.hasMany(UserCourse, { foreignKey: "CourseID", onDelete: "CASCADE" });
UserCourse.belongsTo(Course, { foreignKey: "CourseID" });

Course.hasMany(Assignment, { foreignKey: "CourseID", onDelete: "CASCADE" });
Assignment.belongsTo(Course, { foreignKey: "CourseID" });

Course.hasMany(Exam, { foreignKey: "CourseID", onDelete: "CASCADE" });
Exam.belongsTo(Course, { foreignKey: "CourseID" });

Assignment.hasMany(Question, {
  foreignKey: "AssignmentID",
  onDelete: "CASCADE",
});
Question.belongsTo(Assignment, { foreignKey: "AssignmentID" });

Exam.hasMany(Question, { foreignKey: "ExamID", onDelete: "CASCADE" });
Question.belongsTo(Exam, { foreignKey: "ExamID" });

Question.hasMany(TestCase, { foreignKey: "QuestionID", onDelete: "CASCADE" });
TestCase.belongsTo(Question, { foreignKey: "QuestionID" });

Question.hasMany(Submission, { foreignKey: "QuestionID", onDelete: "CASCADE" });
Submission.belongsTo(Question, { foreignKey: "QuestionID" });

User.hasMany(Submission, { foreignKey: "UserID", onDelete: "CASCADE" });
Submission.belongsTo(User, { foreignKey: "UserID" });

export {
  User,
  Course,
  Assignment,
  UserCourse,
  Exam,
  Question,
  TestCase,
  Submission,
};
