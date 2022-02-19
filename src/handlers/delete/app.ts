import middy from '@middy/core';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpResponseSerializer from '@middy/http-response-serializer';
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

import BookRepository from '/opt/book.repository';
import Errors from '/opt/definitions/errors.enum';
import { buildSuccessReponse } from '/opt/utils';

export const handler: Handler = middy(async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const repo = new BookRepository();
    await repo.delete(event.pathParameters.id);
    return buildSuccessReponse(null);
}).use([
    doNotWaitForEmptyEventLoop(),
    httpErrorHandler({ fallbackMessage: Errors.GENERAL_ERROR }),
    httpJsonBodyParser(),
    httpResponseSerializer({
        serializers: [
            {
                regex: /^application\/json$/,
                serializer: ({ body }) => JSON.stringify(body)
            }
        ],
        default: 'application/json'
    })
]);
