
import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from 'sequelize';


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: 5432, // Default PostgreSQL port
  logging: console.log, // Enable for debugging
  dialectOptions: {
    ssl: {
      require: true, // AWS RDS often requires SSL
      rejectUnauthorized: false, // Use true if using a valid certificate
    },
  },
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;
