import { Request, Response, NextFunction } from 'express';
import Knex from 'knex';
import curry from 'lodash/curry';
import { TABLE_NAME_USER } from '../database/config';
import { HTTPServerError } from '../http/errors';
import camelCaseKeys from '../helpers/camel-case-keys';

interface Dependencies {
  db: Knex
}

async function expandUserMiddleware(dependencies: Dependencies, req: Request, res: Response, next: NextFunction) {
  const {
    db
  } = dependencies;

  const auth0Id = req.user.sub;

  const [user] = await db(TABLE_NAME_USER)
    .where('auth0_id', auth0Id)
    .map(camelCaseKeys);

  if (!user) {
    throw new HTTPServerError('There was an error expanding the authenticated user');
  }

  res.locals.user = user;

  next();
}

export default curry(expandUserMiddleware);