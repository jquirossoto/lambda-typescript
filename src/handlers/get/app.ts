import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpResponseSerializer from '@middy/http-response-serializer';
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import middy from '@middy/core';

import BookRepository from '/opt/repositories/book.repository';
import { buildSuccessReponse } from '/opt/utils/api.utils';
import { Book, Errors } from '/opt/utils/definitions';

export const handler: Handler = middy(async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const book: Book = await BookRepository.findOne(event.pathParameters.id);
    return buildSuccessReponse(book);
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
