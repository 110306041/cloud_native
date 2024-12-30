// import { DataTypes } from "sequelize";
// import sequelize from "../syncDB.js";
import { Sequelize } from "sequelize";

export default (sequelize, DataTypes) => {
  const UserCourse = sequelize.define(
    "UserCourse",
    {
      ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
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
      CreatedAt: {type:DataTypes.DATE, defaultValue:Sequelize.NOW},
      UpdatedAt: {type:DataTypes.DATE, defaultValue:Sequelize.NOW},
      DeletedAt: {type:DataTypes.DATE, allowNull: true}
    },
    {
      tableName: "UserCourse",
      timestamps: false, // Disable createdAt and updatedAt
    }
  );
  return UserCourse;
};
// export default U/serCourse;
