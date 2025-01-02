export default (sequelize, DataTypes) => {
const Submission = sequelize.define(
  "Submission",
  {
    ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    Score: { type: DataTypes.INTEGER, allowNull: true },
    TimeSpend: { type: DataTypes.INTEGER, allowNull: true },
    MemoryUsage: { type: DataTypes.INTEGER, allowNull: true },
    CreatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    Code: { type: DataTypes.TEXT, allowNull: false },
    Language: { type: DataTypes.STRING(50), allowNull: false },
    UserID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "User", key: "ID" },
      onDelete: "CASCADE",
    },
    QuestionID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Question", key: "ID" },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "Submission",
    timestamps: false, 
  }
);
return Submission;
};
