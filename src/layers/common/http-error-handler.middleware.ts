import middy from '@middy/core';
import { HttpError, isHttpError, InternalServerError } from 'http-errors';

import Errors from './definitions/errors.enum';
import { buildErrorResponse } from './utils';

const defaults = {
    fallbackMessage: Errors.GENERAL_ERROR
};

const httpErrorHandler = (opts = {}) => {
    const options = { ...defaults, ...opts };

    return {
        onError: (request: middy.Request<any, any, HttpError>) => {
            if ((isHttpError(request.error) && !request.error.expose) || !isHttpError(request.error)) {
                request.error = new InternalServerError(options.fallbackMessage);
            }
            request.response = buildErrorResponse(request.error.message, request.error.statusCode);
        }
    };
};

export default httpErrorHandler;
