// import { DataTypes } from "sequelize";
// import sequelize from "../syncDB.js";

// const sequelize = db.sequelize; // Use the initialized sequelize instance
export default (sequelize, DataTypes) => {
  const Course = sequelize.define(
    "Course",
    {
      ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      Name: { type: DataTypes.STRING(100), allowNull: false },
      Semester: { type: DataTypes.STRING(100), allowNull: false },
      StudentCount: { type: DataTypes.INTEGER, defaultValue: 0 },
      StudentLimit: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: "Course",
      timestamps: false, // Disable createdAt and updatedAt
    }
  );
  return Course;
};
// export default Course;
