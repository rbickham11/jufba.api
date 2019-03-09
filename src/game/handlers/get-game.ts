import curry from 'lodash/curry';
import { Request } from 'express';
import Knex from 'knex';

import { HandlerResponse } from '../../http/types';
import { HTTPNotFoundError } from '../../http/errors';
import { TABLE_NAME_GAME } from '../../database/config';
import camelCaseKeys from '../../helpers/camel-case-keys';
import makeHandlerResponse from '../../http/make-handler-response';

interface Dependencies {
  db: Knex
}

async function handleGetGame(dependencies: Dependencies, req: Request) : Promise<HandlerResponse> {
  const {
    db,
  } = dependencies;

  const { params } = req;
  const { id } = params;

  const [matchingGame] = await db(TABLE_NAME_GAME)
    .where('id', id)
    .map(camelCaseKeys);
  
  if (!matchingGame) {
    throw new HTTPNotFoundError(`Game "${id}" does not exist`);
  }

  return makeHandlerResponse({ body: matchingGame });
}

export default curry(handleGetGame);