import curry from 'lodash/curry';
import { Request } from 'express';
import Knex from 'knex';

import { HandlerResponse } from '../../http/types';
import { TABLE_NAME_PLAYER } from '../../database/config';
import makeHandlerResponse from '../../http/make-handler-response';
import camelCaseKeys from '../../helpers/camel-case-keys';

interface Dependencies {
  db: Knex
}

async function handleUpdatePlayer(dependencies: Dependencies, req: Request) : Promise<HandlerResponse> {
  const {
    db,
  } = dependencies;

  const { body, params } = req;
  const { playerId } = params;

  const playerUpdates = {
    buy_in: body.buyIn,
    final_chip_count: body.finalChipCount,
    max_chips: body.maxChips,
    min_chips: body.minChips
  };

  const [updateResult] = await db(TABLE_NAME_PLAYER)
    .where('id', playerId)
    .returning('*')
    .update(playerUpdates);
  
  return makeHandlerResponse({ body: camelCaseKeys(updateResult) });
}

export default curry(handleUpdatePlayer);