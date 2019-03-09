import curry from 'lodash/curry';
import pick from 'lodash/pick';
import { Request } from 'express';
import { UsersManager } from 'auth0';
import Knex from 'knex';
import shortid from 'shortid';

import { HandlerResponse } from '../../http/types';
import getAccessToken from '../../helpers/parse-access-token';
import { TABLE_NAME_USER, TABLE_NAME_GROUP_USER, TABLE_NAME_GROUP, TABLE_NAME_PLAYER, TABLE_NAME_GAME } from '../../database/config';
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

    const userPlayerGames = await db(TABLE_NAME_PLAYER)
      .innerJoin(TABLE_NAME_GAME, `${TABLE_NAME_PLAYER}.game_id`, `${TABLE_NAME_GAME}.id`)
      .select([
        `${TABLE_NAME_PLAYER}.id as id`,
        `${TABLE_NAME_PLAYER}.buy_in as buyIn`,
        `${TABLE_NAME_PLAYER}.final_chip_count as finalChipCount`,
        `${TABLE_NAME_PLAYER}.max_chips as maxChips`,
        `${TABLE_NAME_PLAYER}.min_chips as minChips`,
        `${TABLE_NAME_GAME}.id as gameId`,
        `${TABLE_NAME_GAME}.date as gameDate`,
        `${TABLE_NAME_GAME}.name as gameName`,
        `${TABLE_NAME_GAME}.structure as gameStructure`,
        `${TABLE_NAME_GAME}.type as gameType`,
        `${TABLE_NAME_GAME}.state as gameState`,
        `${TABLE_NAME_GAME}.group_id as gameGroupId`
      ])
      .where('user_id', existingUser.id)
      .map(camelCaseKeys);


    const response = { 
      ...existingUser, 
      groups: userGroupRows.map(row => pick(row, ['id', 'description', 'name', 'isAdmin'])),
      players: userPlayerGames.map(pg => ({
        ...pick(pg, ['id', 'buyIn', 'finalChipCount', 'maxChips', 'minChips']),
        game: {
          id: pg.gameId,
          date: pg.gameDate,
          name: pg.gameName,
          structure: pg.gameStructure,
          type: pg.gameType,
          state: pg.gameState,
          groupId: pg.gameGroupId,
        }
      })),
    };

    return makeHandlerResponse({ body: response });
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