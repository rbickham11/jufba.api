import { Router } from 'express';

import transferHandlerResponse from '../http/transfer-handler-response';
import { RequestHandler } from '../http/types';


interface UserHandlers {
  get: RequestHandler;
}

export default function initializeUserRouter(router: Router, handlers: UserHandlers): Router {
  router.get('/', transferHandlerResponse(handlers.get));

  return router;
}