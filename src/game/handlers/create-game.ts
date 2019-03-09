import curry from 'lodash/curry';
import omit from 'lodash/omit';
import { Request } from 'express';
import Knex from 'knex';
import shortid from 'shortid';

import { HandlerResponse } from '../../http/types';
import { TABLE_NAME_GAME } from '../../database/config';
import makeHandlerResponse from '../../http/make-handler-response';
import camelCaseKeys from '../../helpers/camel-case-keys';

interface Dependencies {
  db: Knex
}

async function handleCreateGame(dependencies: Dependencies, req: Request) : Promise<HandlerResponse> {
  const {
    db,
  } = dependencies;

  const { body } = req;

  const gameRow = {
    id: shortid.generate(),
    ...omit(body, ['groupId']),
    group_id: body.groupId,
  };

  const [insertResult] = await db(TABLE_NAME_GAME)
    .returning('*')
    .insert(gameRow);
  
  return makeHandlerResponse({ body: camelCaseKeys(insertResult) });
}

export default curry(handleCreateGame);