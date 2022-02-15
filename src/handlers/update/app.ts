import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpResponseSerializer from '@middy/http-response-serializer';
import { Callback, Context, Handler } from 'aws-lambda';
import middy from '@middy/core';

import BookRepository from '/opt/nodejs/book.repository';
import Book from '../../layers/common/book.interface';
import Errors from '/opt/nodejs/errors.enum';
import { buildSuccessReponse } from '/opt/nodejs/api.utils';
import { CustomAPIGatewayEvent } from '/opt/nodejs/custom-event.type';

export const handler: Handler = middy(
    async (event: CustomAPIGatewayEvent<Book>, context: Context, callback: Callback) => {
        const book: Book = await BookRepository.update(event.pathParameters.id, event.body);
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
