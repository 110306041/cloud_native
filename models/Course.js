import { Sequelize } from "sequelize";

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
      CreatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
      UpdatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
      DeletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: "Course",
      timestamps: false,
    }
  );
  return Course;
};
