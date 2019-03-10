import curry from 'lodash/curry';
import { Request, Response } from 'express';
import Knex from 'knex';

import { HandlerResponse } from '../../http/types';
import { TABLE_NAME_GROUP } from '../../database/config';
import makeHandlerResponse from '../../http/make-handler-response';
import camelCaseKeys from '../../helpers/camel-case-keys';
import { HTTPForbiddenError } from '../../http/errors';

interface Dependencies {
  db: Knex,
  checkIsGroupAdmin: Function,
  getGroupMemberList : Function,
}

async function handleUpdateGroup(dependencies: Dependencies, req: Request, res: Response) : Promise<HandlerResponse> {
  const {
    db,
    checkIsGroupAdmin,
    getGroupMemberList,
  } = dependencies;

  const { body, params } = req;
  const { locals } = res;

  const { id } = params;
  const { description, name } = body;
  const { user } = locals;

  if (!user.isAdmin) {
    const isGroupAdmin = await checkIsGroupAdmin(user.id, id);

    if (!isGroupAdmin) {
      throw new HTTPForbiddenError('You are not authorized to perform this action');
    }
  }

  const groupUpdates = {
    name,
    description,
  };

  const [updateResult] = await db(TABLE_NAME_GROUP)
    .where('id', id)
    .returning('*')
    .update(groupUpdates)
    .map(camelCaseKeys);
  
  return makeHandlerResponse({ body: { ...updateResult, members: await getGroupMemberList(id) } });
}

export default curry(handleUpdateGroup);