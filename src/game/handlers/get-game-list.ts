import curry from 'lodash/curry';
import { Request } from 'express';
import Knex from 'knex';

import { HandlerResponse } from '../../http/types';
import { TABLE_NAME_GAME } from '../../database/config';
import camelCaseKeys from '../../helpers/camel-case-keys';
import makeHandlerResponse from '../../http/make-handler-response';

interface Dependencies {
  db: Knex
}

async function handleGetGameList(dependencies: Dependencies, req: Request) : Promise<HandlerResponse> {
  const {
    db,
  } = dependencies;

  const { query } = req;
  const { groupId } = query;
  
  let gameQuery = db(TABLE_NAME_GAME).select('*');

  if (groupId) gameQuery = gameQuery.where('group_id', groupId);

  const result = await gameQuery.map(camelCaseKeys);
  
  return makeHandlerResponse({ body: result });
}

export default curry(handleGetGameList);