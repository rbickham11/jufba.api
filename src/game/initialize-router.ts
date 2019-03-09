import { Router } from 'express';

import transferHandlerResponse from '../http/transfer-handler-response';
import { RequestHandler } from '../http/types';
import joiValidate from '../middleware/joi-validate';

import gameCreateRequest from './schema/game-create-request';
import gameUpdateRequest from './schema/game-update-request';
import playerCreateRequest from './schema/player-create-request';
import playerUpdateRequest from './schema/player-update-request';


interface GameHandlers {
  list: RequestHandler;
  create: RequestHandler;
  get: RequestHandler;
  update: RequestHandler;
  destroy: RequestHandler;

  getPlayerList: RequestHandler;
  createPlayer: RequestHandler;
  updatePlayer: RequestHandler;
  destroyPlayer: RequestHandler;
}

export default function initializeGameRouter(router: Router, handlers: GameHandlers): Router {
  router.get('/', transferHandlerResponse(handlers.list));
  router.post('/', joiValidate(gameCreateRequest), transferHandlerResponse(handlers.create));
  router.get('/:id', transferHandlerResponse(handlers.get));
  router.put('/:id', joiValidate(gameUpdateRequest), transferHandlerResponse(handlers.update));
  router.delete('/:id', transferHandlerResponse(handlers.destroy));

  router.get('/:id/players', transferHandlerResponse(handlers.getPlayerList));
  router.post('/:id/players', joiValidate(playerCreateRequest), transferHandlerResponse(handlers.createPlayer));
  router.put('/:id/players/:playerId', joiValidate(playerUpdateRequest), transferHandlerResponse(handlers.updatePlayer));
  router.delete('/:id/players/:playerId', transferHandlerResponse(handlers.destroyPlayer));

  return router;
}