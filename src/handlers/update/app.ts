import middy from '@middy/core';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpResponseSerializer from '@middy/http-response-serializer';
import { Callback, Context, Handler } from 'aws-lambda';

import BookRepository from '/opt/book.repository';
import APIGatewayEvent from '/opt/definitions/api-gateway-event.alias';
import Book from '/opt/definitions/book.interface';
import Errors from '/opt/definitions/errors.enum';
import { buildSuccessReponse } from '/opt/utils';

export const handler: Handler = middy(async (event: APIGatewayEvent<Book>, context: Context, callback: Callback) => {
    const repo = new BookRepository();
    const book: Book = await repo.update(event.pathParameters.id, event.body);
    return buildSuccessReponse(book);
}).use([
    doNotWaitForEmptyEventLoop(),
    httpJsonBodyParser(),
    httpErrorHandler({ fallbackMessage: Errors.GENERAL_ERROR }),
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
