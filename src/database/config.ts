import { hostname } from 'os';


export const HTTP_PORT = process.env.HTTP_PORT || 8000;

export const DB_HOST = process.env.DB_HOST || '127.0.0.1';
export const DB_PORT = process.env.DB_PORT || 5432;
export const DB_DATABASE = process.env.DB_DATABASE || 'jufba';
export const DB_USER = process.env.DB_USER || 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD || hostname();
export const DB_MIGRATION_DIRECTORY = `${__dirname}/migrations`;

export const TABLE_NAME_GAME = 'game';
export const TABLE_NAME_GROUP = '_group';
export const TABLE_NAME_GROUP_USER = 'group_user';
export const TABLE_NAME_PLAYER = 'player';
export const TABLE_NAME_USER = '_user';
