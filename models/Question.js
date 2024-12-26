import { DataTypes } from "sequelize";
import sequelize from "../syncDB.js";
const Question = sequelize.define(
  "Question",
  {
    ID: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    Name: { type: DataTypes.STRING(100), allowNull: false },
    Description: { type: DataTypes.TEXT, allowNull: true },
    TimeLimit: { type: DataTypes.INTEGER, allowNull: false },
    MemoryLimit: { type: DataTypes.INTEGER, allowNull: false },
    Difficulty: { type: DataTypes.STRING(50), allowNull: true },
    Constraints: { type: DataTypes.TEXT, allowNull: true },
    SampleTestCase: { type: DataTypes.TEXT, allowNull: true },
    SubmissionLimit: { type: DataTypes.INTEGER, allowNull: true },
    AssignmentID: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Assignment", key: "ID" },
      onDelete: "CASCADE",
    },
    ExamID: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Exam", key: "ID" },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "Question",
    timestamps: false, // Disable createdAt and updatedAt
  }
);
export default Question;
