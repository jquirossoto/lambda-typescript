import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import httpResponseSerializer from '@middy/http-response-serializer';
import { Callback, Context, Handler } from 'aws-lambda';
import middy from '@middy/core';

import BookRepository from '/opt/repositories/book.repository';
import { buildSuccessReponse } from '/opt/utils/api.utils';
import { Book, CustomAPIGatewayEvent, Errors } from '/opt/utils/definitions';

export const handler: Handler = middy(
    async (event: CustomAPIGatewayEvent<Book>, context: Context, callback: Callback) => {
        const book: Book = await BookRepository.create(event.body);
        return buildSuccessReponse(book);
    }
).use([
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
