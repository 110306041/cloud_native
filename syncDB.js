import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";
import db from './models/index.js'; // Import the models index file

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: 5432, // Default PostgreSQL port
    // logging: console.log, // Enable for debugging
    dialectOptions: {
      ssl: {
        require: true, // AWS RDS often requires SSL
        rejectUnauthorized: false, // Use true if using a valid certificate
      },
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
db.sequelize
  .sync({ alter: true }) // Use `{ force: true }` to drop tables and recreate them
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((err) => {
    console.error("Error synchronizing models:", err);
  });

export default sequelize;
