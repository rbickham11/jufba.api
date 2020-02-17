import Knex from 'knex';
import curry from 'lodash/curry';
import pick from 'lodash/pick';
import { TABLE_NAME_GROUP_USER, TABLE_NAME_USER } from '../database/config';
import camelCaseKeys from '../helpers/camel-case-keys';

interface Dependencies {
  db: Knex
}

async function getGroupMemberList(dependencies: Dependencies, groupId: string) : Promise<Object[]> {
  const {
    db
  } = dependencies;

  const result = await db(TABLE_NAME_GROUP_USER)
    .innerJoin(TABLE_NAME_USER, `${TABLE_NAME_GROUP_USER}.user_id`, `${TABLE_NAME_USER}.id`)
    .where(`${TABLE_NAME_GROUP_USER}.group_id`, groupId)
    .select(
      `${TABLE_NAME_USER}.id as id`,
      `${TABLE_NAME_USER}.first_name as firstName`,
      `${TABLE_NAME_USER}.last_name AS lastName`,
      `${TABLE_NAME_USER}.email AS email`,
      `${TABLE_NAME_USER}.is_admin AS isAdmin`,
      `${TABLE_NAME_GROUP_USER}.is_admin AS isGroupAdmin`
    );

  return result
    .map(camelCaseKeys)
    .map(gu => ({
      user: pick(gu, ['id', 'firstName', 'lastName', 'email', 'isAdmin']),
      isAdmin: gu.isGroupAdmin
    }))
      
}

export default curry(getGroupMemberList);