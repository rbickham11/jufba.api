import curry from 'lodash/curry';
import { Request } from 'express';
import Knex from 'knex';

import { HandlerResponse } from '../../http/types';
import { TABLE_NAME_GAME } from '../../database/config';
import makeHandlerResponse from '../../http/make-handler-response';

interface Dependencies {
  db: Knex
}

async function handleDestroyGame(dependencies: Dependencies, req: Request) : Promise<HandlerResponse> {
  const {
    db,
  } = dependencies;

  const { params } = req;
  const { id } = params;

  await db(TABLE_NAME_GAME)
    .where('id', id)
    .del();
  
  return makeHandlerResponse({ body: null });
}

export default curry(handleDestroyGame);