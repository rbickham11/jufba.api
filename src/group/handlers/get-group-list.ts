import curry from 'lodash/curry';
import { Request } from 'express';
import Knex from 'knex';

import { HandlerResponse } from '../../http/types';
import { TABLE_NAME_GROUP } from '../../database/config';
import camelCaseKeys from '../../helpers/camel-case-keys';
import makeHandlerResponse from '../../http/make-handler-response';

interface Dependencies {
  db: Knex
}

async function handleGetGroupList(dependencies: Dependencies, req: Request) : Promise<HandlerResponse> {
  const {
    db,
  } = dependencies;

  const result = await db(TABLE_NAME_GROUP)
    .select('*')
    .map(camelCaseKeys);

  return makeHandlerResponse({ body: result });
}

export default curry(handleGetGroupList);