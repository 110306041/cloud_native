import { DataTypes } from "sequelize";
import sequelize from "../syncDB.js";
const User = sequelize.define(
  "User",
  {
    ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    Type: { type: DataTypes.STRING(50), allowNull: false },
    Name: { type: DataTypes.STRING(100), allowNull: false },
    Email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    Password: { type: DataTypes.STRING(255), allowNull: false },
  },
  {
    tableName: "User",
    timestamps: false, // Disable createdAt and updatedAt
  }
);
export default User;
