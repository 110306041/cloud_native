import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import { fileURLToPath } from 'url';
import { initializeAssociations } from './associations.js'; 
import configFile from '../config/config.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configFile[env];

const db = {};
let sequelize;

// 1) Create the Sequelize instance
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// 2) Read all JS files in this directory (except index.js itself)
const modelFiles = fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file !== 'associations.js' && 
      file.endsWith('.js') &&
      !file.endsWith('.test.js')
    );
  });

// 3) Import each model and attach to db object
for (const file of modelFiles) {
  // Each model file exports a function: (sequelize, DataTypes) => { ... }
  const modelImport = await import(path.join(__dirname, file));
  const initModelFunc = modelImport.default; // By convention
  const model = initModelFunc(sequelize, DataTypes);
  db[model.name] = model;
}

// 4) Initialize associations, if you have them
initializeAssociations(db);

// 5) Attach the Sequelize instance to db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 6) Export the db object (contains all models + sequelize instance)
export default db;
