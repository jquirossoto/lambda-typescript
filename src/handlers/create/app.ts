import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import httpResponseSerializer from '@middy/http-response-serializer';
import { Callback, Context, Handler } from 'aws-lambda';
import middy from '@middy/core';

import BookRepository from '/opt/nodejs/repositories/book.repository';
import { CustomAPIGatewayEvent } from '/opt/nodejs/definitions/custom-gateway-event.alias';
import Book from '/opt/nodejs/definitions/book.interface';
import { buildSuccessReponse } from '/opt/nodejs/utils/api.utils';
import Errors from '/opt/nodejs/definitions/errors.enum';

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
