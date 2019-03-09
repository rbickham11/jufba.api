import curry from 'lodash/curry';
import pick from 'lodash/pick';
import { Request } from 'express';
import { UsersManager } from 'auth0';
import Knex from 'knex';
import shortid from 'shortid';

import { HandlerResponse } from '../../http/types';
import getAccessToken from '../../helpers/parse-access-token';
import { TABLE_NAME_USER, TABLE_NAME_GROUP_USER, TABLE_NAME_GROUP } from '../../database/config';
import makeHandlerResponse from '../../http/make-handler-response';
import camelCaseKeys from '../../helpers/camel-case-keys';

interface Dependencies {
  auth0UsersManager : UsersManager;
  db: Knex
}

async function handleGetUser(dependencies: Dependencies, req: Request) : Promise<HandlerResponse> {
  const {
    auth0UsersManager,
    db,
  } = dependencies;

  const auth0Id = req.user.sub;

  const [existingUser] = await db(TABLE_NAME_USER)
    .where('auth0_id', auth0Id)
    .map(camelCaseKeys);

  if (existingUser) {
    const userGroupRows = await db(TABLE_NAME_GROUP_USER)
      .innerJoin(TABLE_NAME_GROUP, `${TABLE_NAME_GROUP_USER}.group_id`, `${TABLE_NAME_GROUP}.id`)
      .select('*')
      .where('user_id', existingUser.id)
      .map(camelCaseKeys);

    return makeHandlerResponse({ body: { ...existingUser, groups: userGroupRows.map(row => pick(row, ['id', 'description', 'name', 'isAdmin'])) } });
  }

  const accessToken = getAccessToken(req);

  const userInfo = await auth0UsersManager.getInfo(accessToken);

  if (userInfo === 'Unauthorized') {
    return makeHandlerResponse({ 
      status: 500, 
      body: { message: 'An error occurred retrieving the authenticated user' }
    })
  }

  const userReq = {
    id: shortid.generate(),
    auth0_id: auth0Id,
    first_name: userInfo.given_name,
    last_name: userInfo.family_name,
    email: userInfo.email,
  };

  const [insertResult] = await db(TABLE_NAME_USER)
    .returning('*')
    .insert(userReq);
  
  return makeHandlerResponse({ body: camelCaseKeys(insertResult) });
}

export default curry(handleGetUser);