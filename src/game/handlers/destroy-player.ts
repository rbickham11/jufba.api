import curry from 'lodash/curry';
import { Request } from 'express';
import Knex from 'knex';

import { HandlerResponse } from '../../http/types';
import { TABLE_NAME_PLAYER } from '../../database/config';
import makeHandlerResponse from '../../http/make-handler-response';

interface Dependencies {
  db: Knex
}

async function handleDestroyGame(dependencies: Dependencies, req: Request) : Promise<HandlerResponse> {
  const {
    db,
  } = dependencies;

  const { params } = req;
  const { playerId } = params;

  await db(TABLE_NAME_PLAYER)
    .where('id', playerId)
    .del();
  
  return makeHandlerResponse({ body: null });
}

export default curry(handleDestroyGame);