// import { DataTypes } from "sequelize";
// import sequelize from "../syncDB.js";
import { Sequelize } from "sequelize";

export default (sequelize, DataTypes) => {
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
      CreatedAt: {type:DataTypes.DATE, defaultValue:Sequelize.NOW},
      UpdatedAt: {type:DataTypes.DATE, defaultValue:Sequelize.NOW},
      DeletedAt: {type:DataTypes.DATE, allowNull: true}
    },
    {
      tableName: "User",
      timestamps: false, // Disable createdAt and updatedAt
    }
  );
  return User;
};
// export default User;
