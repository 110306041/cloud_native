// import { DataTypes } from "sequelize";
// import sequelize from "../syncDB.js";
export default (sequelize, DataTypes) => {
const TestCase = sequelize.define(
  "TestCase",
  {
    ID: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    Input: { type: DataTypes.TEXT, allowNull: false },
    Output: { type: DataTypes.TEXT, allowNull: false },
    Sequence: { type: DataTypes.INTEGER, allowNull: false },
    QuestionID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Question", key: "ID" },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "TestCase",
    timestamps: false, // Disable createdAt and updatedAt
  }
);
return TestCase;
};
// export default TestCase;
