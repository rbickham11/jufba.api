import each from 'lodash/each';
import isUndefined from 'lodash/isUndefined';
import { RequestHandler as ExpressRequestHandler, Request, Response, NextFunction } from 'express';
import { HandlerResponse, RequestHandler } from './types';
import resolveErrorToStatus from './resolve-error-to-status';


export default function transferHandlerResponse(handleRequest: RequestHandler): ExpressRequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let response: HandlerResponse;
    try {
      response = await handleRequest(req, res);
    } catch (err) {
      const status = resolveErrorToStatus(err);

      res.status(status).json({ message: err.message});
      
      return;
    }

    const { body, headers, status } = response;

    if (headers) {
      each(headers, (val: string, key: string) => res.set(key, val));
    }

    res.status(status || 200);

    if (isUndefined(body)) {
      res.status(204).end();

      return;
    }

    res.json(body);
  };
}
