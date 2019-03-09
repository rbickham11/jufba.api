import {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
  DB_MIGRATION_DIRECTORY,
} from './config';


const connection = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
};

export = {
  client: 'pg',
  connection,

  migrations: {
    directory: DB_MIGRATION_DIRECTORY,
  },

  pool: {
    min: 0,
    max: 10,
  },

};