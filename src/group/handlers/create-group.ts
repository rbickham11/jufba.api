import curry from 'lodash/curry';
import { Request } from 'express';
import Knex from 'knex';
import shortid from 'shortid';

import { HandlerResponse } from '../../http/types';
import { TABLE_NAME_GROUP } from '../../database/config';
import makeHandlerResponse from '../../http/make-handler-response';
import camelCaseKeys from '../../helpers/camel-case-keys';

interface Dependencies {
  db: Knex
}

async function handleCreateGroup(dependencies: Dependencies, req: Request) : Promise<HandlerResponse> {
  const {
    db,
  } = dependencies;

  const { body } = req;
  const { description, name } = body;

  const groupRow = {
    id: shortid.generate(),
    name,
    description,
  };

  const [insertResult] = await db(TABLE_NAME_GROUP)
    .returning('*')
    .insert(groupRow);
  
  return makeHandlerResponse({ body: camelCaseKeys(insertResult) });
}

export default curry(handleCreateGroup);