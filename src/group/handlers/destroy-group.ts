import curry from 'lodash/curry';
import { Request, Response } from 'express';
import Knex from 'knex';

import { HandlerResponse } from '../../http/types';
import { TABLE_NAME_GROUP } from '../../database/config';
import makeHandlerResponse from '../../http/make-handler-response';
import { HTTPForbiddenError } from '../../http/errors';

interface Dependencies {
  db: Knex,
  checkIsGroupAdmin: Function
}

async function handleDestroyGroup(dependencies: Dependencies, req: Request, res: Response) : Promise<HandlerResponse> {
  const {
    db,
    checkIsGroupAdmin,
  } = dependencies;

  const { params } = req;
  const { locals } = res;

  const { id } = params;
  const { user } = locals;

  if (!user.isAdmin) {
    const isGroupAdmin = await checkIsGroupAdmin(user.id, id);

    if (!isGroupAdmin) {
      throw new HTTPForbiddenError('You are not authorized to perform this action');
    }
  }

  await db(TABLE_NAME_GROUP)
    .where('id', id)
    .del();
  
  return makeHandlerResponse({ body: null });
}

export default curry(handleDestroyGroup);