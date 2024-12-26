import { DataTypes } from "sequelize";
import sequelize from "../syncDB.js";
const Course = sequelize.define(
  "Course",
  {
    ID: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    Name: { type: DataTypes.STRING(100), allowNull: false },
    Semester: { type: DataTypes.INTEGER, allowNull: false },
    StudentCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    StudentLimit: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "Course",
    timestamps: false, // Disable createdAt and updatedAt
  }
);
export default Course;
