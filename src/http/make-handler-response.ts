import mimeTypes from 'mime-types';

import { HandlerResponse } from './types';

const DEFAULT_PROPS = {
  status: 200,
  contentType: mimeTypes.lookup('json'),
};

export default function makeHandlerResponse(props={}) : HandlerResponse {
  return {
    ...DEFAULT_PROPS,
    ...props,
  }
};