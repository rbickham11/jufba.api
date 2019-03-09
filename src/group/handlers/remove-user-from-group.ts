import curry from 'lodash/curry';
import { Request, Response } from 'express';
import Knex from 'knex';

import { HandlerResponse } from '../../http/types';
import { TABLE_NAME_GROUP_USER } from '../../database/config';
import makeHandlerResponse from '../../http/make-handler-response';
import { HTTPNotFoundError, HTTPBadRequestError, HTTPForbiddenError } from '../../http/errors';

interface Dependencies {
  db: Knex,
  checkIsGroupAdmin: Function,
}

async function handleRemoveUserFromGroup(dependencies: Dependencies, req: Request, res: Response) : Promise<HandlerResponse> {
  const {
    db,
    checkIsGroupAdmin,
  } = dependencies;

  const { params, query } = req;
  const { locals } = res;

  const { id } = params;
  const { userId } = query;
  const { user } = locals;

  if (!userId) {
    throw new HTTPBadRequestError(`userId query parameter is required`);
  }

  if (!user.isAdmin && userId !== user.id) {
    const isGroupAdmin = await checkIsGroupAdmin(user.id, id);

    if (!isGroupAdmin) {
      throw new HTTPForbiddenError('You are not authorized to perform this action');
    }
  }

  const [existingRow] = await db(TABLE_NAME_GROUP_USER)
    .where('group_id', id)
    .andWhere('user_id', userId);

  if (!existingRow) {
    throw new HTTPNotFoundError(`User ${userId} does not belong to this group`);
  }

  await db(TABLE_NAME_GROUP_USER)
    .where('group_id', id)
    .andWhere('user_id', userId)
    .del();

  return makeHandlerResponse({ body: null });
}

export default curry(handleRemoveUserFromGroup);