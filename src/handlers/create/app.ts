import middy from '@middy/core';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpResponseSerializer from '@middy/http-response-serializer';
import { Handler } from 'aws-lambda';

import { create } from '/opt/book.repository';
import APIGatewayEvent from '/opt/definitions/api-gateway-event.alias';
import APIGatewayResult from '/opt/definitions/api-gateway-result.interface';
import Book from '/opt/definitions/book.interface';
import Errors from '/opt/definitions/errors.enum';
import httpErrorHandler from '/opt/http-error-handler.middleware';
import { buildSuccessResponse, httpResponseSerializerOptions } from '/opt/utils';

export const handler: Handler<APIGatewayEvent<Book>> = middy(
    async (event: APIGatewayEvent<Book>): Promise<APIGatewayResult<Book>> => {
        const book: Book = await create(event.body);
        return buildSuccessResponse(book);
    }
).use([
    doNotWaitForEmptyEventLoop(),
    httpJsonBodyParser(),
    httpErrorHandler({ fallbackMessage: Errors.GENERAL_ERROR }),
    httpResponseSerializer(httpResponseSerializerOptions)
]);
