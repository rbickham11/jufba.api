import CustomError from 'custom-error-generator';
import { isFunction, isUndefined } from 'lodash/lang';


export const HTTPError = makeError('HTTPError');
export const HTTPBadRequestError = makeError('HTTPBadRequestError', HTTPError);
export const HTTPConflictError = makeError('HTTPConflictError', HTTPError);
export const HTTPNotFoundError = makeError('HTTPNotFoundError', HTTPError);
export const HTTPServerError = makeError('HTTPServerError', HTTPError);
export const HTTPForbiddenError = makeError('HTTPForbiddenError', HTTPError);


function makeError(name, paramaters={}, Constructor?) {
  if (isUndefined(Constructor) && isFunction(paramaters)) {
    Constructor = paramaters;
    paramaters = {};
  }

  return CustomError(name, paramaters, Constructor);
}