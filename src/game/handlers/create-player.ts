import curry from 'lodash/curry';
import { Request } from 'express';
import Knex from 'knex';
import shortid from 'shortid';

import { HandlerResponse } from '../../http/types';
import { TABLE_NAME_PLAYER } from '../../database/config';
import makeHandlerResponse from '../../http/make-handler-response';
import camelCaseKeys from '../../helpers/camel-case-keys';

interface Dependencies {
  db: Knex
}

async function handleCreatePlayer(dependencies: Dependencies, req: Request) : Promise<HandlerResponse> {
  const {
    db,
  } = dependencies;

  const { body, params } = req;
  const { id: gameId } = params;

  const playerRow = {
    id: shortid.generate(),
    game_id: gameId,
    user_id: body.userId,
    buy_in: body.buyIn,
    final_chip_count: body.finalChipCount,
    max_chips: body.maxChips,
    min_chips: body.minChips
  };

  const [insertResult] = await db(TABLE_NAME_PLAYER)
    .returning('*')
    .insert(playerRow);
  
  return makeHandlerResponse({ body: camelCaseKeys(insertResult) });
}

export default curry(handleCreatePlayer);