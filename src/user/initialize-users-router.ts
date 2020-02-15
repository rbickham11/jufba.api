import { Router } from 'express';

import transferHandlerResponse from '../http/transfer-handler-response';
import { RequestHandler } from '../http/types';
import joiValidate from '../middleware/joi-validate';

import userUpdateRequest from './schema/user-update-request';

interface UsersHandlers {
  update: RequestHandler;
}

export default function initializeUserRouter(router: Router, handlers: UsersHandlers): Router {
  router.put('/:id', joiValidate(userUpdateRequest), transferHandlerResponse(handlers.update));

  return router;
}