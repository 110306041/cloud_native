import { DataTypes } from "sequelize";
import sequelize from "../syncDB.js";
const UserCourse = sequelize.define(
  "UserCourse",
  {
    ID: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    UserID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "User", key: "ID" },
      onDelete: "CASCADE",
    },
    CourseID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Course", key: "ID" },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "UserCourse",
    timestamps: false, // Disable createdAt and updatedAt
  }
);
export default UserCourse;
