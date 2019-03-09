import curry from 'lodash/curry';
import { Request, Response } from 'express';
import Knex from 'knex';
import shortid from 'shortid';

import { HandlerResponse } from '../../http/types';
import { TABLE_NAME_GROUP, TABLE_NAME_GROUP_USER } from '../../database/config';
import makeHandlerResponse from '../../http/make-handler-response';
import camelCaseKeys from '../../helpers/camel-case-keys';

interface Dependencies {
  db: Knex
}

async function handleCreateGroup(dependencies: Dependencies, req: Request, res: Response) : Promise<HandlerResponse> {
  const {
    db,
  } = dependencies;

  const { body } = req;
  const { locals } = res;
  const { user } = locals;
  const { description, name } = body;

  const groupRow = {
    id: shortid.generate(),
    name,
    description,
  };

  const [insertResult] = await db(TABLE_NAME_GROUP)
    .returning('*')
    .insert(groupRow)
    .map(camelCaseKeys);
  
  // Make the creator a group admin
  await db(TABLE_NAME_GROUP_USER)
    .insert({
      user_id: user.id,
      group_id: insertResult.id,
      is_admin: true,
    })

  return makeHandlerResponse({ body: { ...insertResult, admins: [user] } });
}

export default curry(handleCreateGroup);