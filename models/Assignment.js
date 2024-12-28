// import { DataTypes } from "sequelize";
// import sequelize from "../syncDB.js";
export default (sequelize, DataTypes) => {
  const Assignment = sequelize.define(
    "Assignment",
    {
      ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      Name: { type: DataTypes.STRING(100), allowNull: false },
      DueDate: { type: DataTypes.DATE, allowNull: false },
      Description: { type: DataTypes.TEXT, allowNull: true },
      CourseID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Course", key: "ID" },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "Assignment",
      timestamps: false, // Disable createdAt and updatedAt
    }
  );
  return Assignment;
};
// export default Assignment;
