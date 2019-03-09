import curry from 'lodash/curry';
import { Request } from 'express';
import Knex from 'knex';

import { HandlerResponse } from '../../http/types';
import { TABLE_NAME_PLAYER } from '../../database/config';
import camelCaseKeys from '../../helpers/camel-case-keys';
import makeHandlerResponse from '../../http/make-handler-response';

interface Dependencies {
  db: Knex
}

async function handleGetGamePlayerList(dependencies: Dependencies, req: Request) : Promise<HandlerResponse> {
  const {
    db,
  } = dependencies;

  const { params } = req;
  const { id } = params;
  
  const playerResult = await db(TABLE_NAME_PLAYER)
    .where('game_id', id)
    .select('*');


  const result = await playerResult.map(camelCaseKeys);
  
  return makeHandlerResponse({ body: result });
}

export default curry(handleGetGamePlayerList);