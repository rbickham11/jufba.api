import {
  HTTPBadRequestError,
  HTTPConflictError,
  HTTPForbiddenError,
  HTTPNotFoundError,
} from './errors';

export default function resolveErrorToStatus(err) {
  if (!err.constructor) return 500;

  switch (err.constructor) {
    case HTTPBadRequestError:
      return 400;
    case HTTPConflictError:
      return 409;
    case HTTPForbiddenError:
      return 403;
    case HTTPNotFoundError:
      return 404;
    default:
      return 500;
  }
}