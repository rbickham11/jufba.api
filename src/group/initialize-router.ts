import { Router } from 'express';

import transferHandlerResponse from '../http/transfer-handler-response';
import { RequestHandler } from '../http/types';


interface GroupHandlers {
  list: RequestHandler;
  create: RequestHandler;
  get: RequestHandler;
  update: RequestHandler;
  destroy: RequestHandler;
  upsertUser: RequestHandler;
}

export default function initializeUserRouter(router: Router, handlers: GroupHandlers): Router {
  router.get('/', transferHandlerResponse(handlers.list));
  router.post('/', transferHandlerResponse(handlers.create));
  router.get('/:id', transferHandlerResponse(handlers.get));
  router.put('/:id', transferHandlerResponse(handlers.update));
  router.delete('/:id', transferHandlerResponse(handlers.destroy));
  router.post('/:id/users', transferHandlerResponse(handlers.upsertUser));

  return router;
}