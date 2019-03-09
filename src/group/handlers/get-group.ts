import curry from 'lodash/curry';
import { Request } from 'express';
import Knex from 'knex';

import { HandlerResponse } from '../../http/types';
import { HTTPNotFoundError } from '../../http/errors';
import { TABLE_NAME_GROUP } from '../../database/config';
import camelCaseKeys from '../../helpers/camel-case-keys';
import makeHandlerResponse from '../../http/make-handler-response';

interface Dependencies {
  db: Knex
}

async function handleGetGroup(dependencies: Dependencies, req: Request) : Promise<HandlerResponse> {
  const {
    db,
  } = dependencies;

  const { params } = req;
  const { id } = params;

  const [matchingGroup] = await db(TABLE_NAME_GROUP)
    .where('id', id)
    .map(camelCaseKeys);
  
  if (!matchingGroup) {
    throw new HTTPNotFoundError(`Group "${id}" does not exist`);
  }

  return makeHandlerResponse({ body: matchingGroup });
}

export default curry(handleGetGroup);