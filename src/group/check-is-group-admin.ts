import Knex from 'knex';
import curry from 'lodash/curry';
import { TABLE_NAME_GROUP_USER } from '../database/config';
import camelCaseKeys from '../helpers/camel-case-keys';

interface Dependencies {
  db: Knex
}

async function checkIsGroupAdmin(dependencies: Dependencies, userId: string, groupId: string) {
  const {
    db
  } = dependencies;

  const [groupUserResult] = await db(TABLE_NAME_GROUP_USER)
    .where('user_id', userId)
    .andWhere('group_id', groupId)
    .select('*')
    .map(camelCaseKeys);

  return groupUserResult ? groupUserResult.isAdmin : false;
}

export default curry(checkIsGroupAdmin);