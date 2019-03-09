import curry from 'lodash/curry';
import { Request } from 'express';
import Knex from 'knex';

import { HandlerResponse } from '../../http/types';
import { TABLE_NAME_GROUP } from '../../database/config';
import makeHandlerResponse from '../../http/make-handler-response';
import camelCaseKeys from '../../helpers/camel-case-keys';

interface Dependencies {
  db: Knex
}

async function handleUpdateGroup(dependencies: Dependencies, req: Request) : Promise<HandlerResponse> {
  const {
    db,
  } = dependencies;

  const { body, params } = req;
  const { id } = params;
  const { description, name } = body;

  const groupUpdates = {
    name,
    description,
  };

  const [updateResult] = await db(TABLE_NAME_GROUP)
    .where('id', id)
    .returning('*')
    .update(groupUpdates);
  
  return makeHandlerResponse({ body: camelCaseKeys(updateResult) });
}

export default curry(handleUpdateGroup);