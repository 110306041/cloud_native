import { Sequelize } from "sequelize";

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
      CreatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
      UpdatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
      DeletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: "TestCase",
      timestamps: false,
    }
  );
  return TestCase;
};
