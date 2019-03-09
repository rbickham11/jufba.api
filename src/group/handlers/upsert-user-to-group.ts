import curry from 'lodash/curry';
import isEmpty from 'lodash/isEmpty';
import { Request } from 'express';
import Knex from 'knex';

import { HandlerResponse } from '../../http/types';
import { TABLE_NAME_GROUP_USER } from '../../database/config';
import makeHandlerResponse from '../../http/make-handler-response';
import camelCaseKeys from '../../helpers/camel-case-keys';

interface Dependencies {
  db: Knex
}

async function handleUpsertUserToGroup(dependencies: Dependencies, req: Request) : Promise<HandlerResponse> {
  const {
    db,
  } = dependencies;

  const { body, params } = req;
  const { id } = params;
  const { userId, isAdmin } = body;

  const [existingRow] = await db(TABLE_NAME_GROUP_USER)
    .where('group_id', id)
    .andWhere('user_id', userId);

  if (existingRow && !isEmpty({ isAdmin })) {
    const [updatedRow] = await db(TABLE_NAME_GROUP_USER)
      .where('group_id', id)
      .andWhere('user_id', userId)
      .returning('*')
      .update({
        is_admin: isAdmin,
      })
      .map(camelCaseKeys);
    
    return makeHandlerResponse({ body: updatedRow });
  }

  const [insertedRow] = await db(TABLE_NAME_GROUP_USER)
    .returning('*')
    .insert({
      user_id: userId,
      group_id: id,
      is_admin: isAdmin,
    })
    .map(camelCaseKeys);

  return makeHandlerResponse({ body: insertedRow });
}

export default curry(handleUpsertUserToGroup);