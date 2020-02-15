import curry from 'lodash/curry';
import { Request, Response } from 'express';
import Knex from 'knex';

import { HandlerResponse } from '../../http/types';
import { TABLE_NAME_USER } from '../../database/config';
import makeHandlerResponse from '../../http/make-handler-response';
import camelCaseKeys from '../../helpers/camel-case-keys';
import snakeCaseKeys from '../../helpers/snake-case-keys';
import { HTTPForbiddenError } from '../../http/errors';

interface Dependencies {
  db: Knex
}

async function handleUpdateUser(dependencies: Dependencies, req: Request, res: Response) : Promise<HandlerResponse> {
  const {
    db,
  } = dependencies;

  const { body, params } = req;
  const { locals } = res;
  const { id } = params;
  const { user } = locals;

  if (!user.isAdmin && id !== user.id) {
    throw new HTTPForbiddenError('You are not authorized to perform this action');
  }
  
  const userUpdates = snakeCaseKeys(body);

  const [updateResult] = await db(TABLE_NAME_USER)
    .where('id', id)
    .returning('*')
    .update(userUpdates);
  
  return makeHandlerResponse({ body: camelCaseKeys(updateResult) });
}

export default curry(handleUpdateUser);