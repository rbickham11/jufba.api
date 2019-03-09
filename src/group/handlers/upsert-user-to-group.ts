import curry from 'lodash/curry';
import isEmpty from 'lodash/isEmpty';
import { Request, Response } from 'express';
import Knex from 'knex';

import { HandlerResponse } from '../../http/types';
import { TABLE_NAME_GROUP_USER } from '../../database/config';
import makeHandlerResponse from '../../http/make-handler-response';
import camelCaseKeys from '../../helpers/camel-case-keys';
import { HTTPForbiddenError } from '../../http/errors';

interface Dependencies {
  db: Knex
  checkIsGroupAdmin: Function
}

async function handleUpsertUserToGroup(dependencies: Dependencies, req: Request, res: Response) : Promise<HandlerResponse> {
  const {
    db,
    checkIsGroupAdmin,
  } = dependencies;

  const { body, params } = req;
  const { locals } = res;

  const { id } = params;
  const { userId, isAdmin } = body;
  const { user } = locals;

  if (!user.isAdmin && (isAdmin || userId !== user.id)) {
    const isGroupAdmin = await checkIsGroupAdmin(user.id, id);

    if (!isGroupAdmin) {
      throw new HTTPForbiddenError('You are not authorized to perform this action');
    }
  }

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