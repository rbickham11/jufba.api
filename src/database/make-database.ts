import Knex from 'knex';
import isUndefined from 'lodash/isUndefined';
import config from './knexfile';


let dbCache : Knex;

export default function makeDatabase(sharedPool: boolean = true): Knex {
  const database = (isUndefined(dbCache) || !sharedPool)
    ? Knex(config)
    : dbCache;

  if (isUndefined(dbCache) && sharedPool) {
    dbCache = database;
  }

  return database;
}