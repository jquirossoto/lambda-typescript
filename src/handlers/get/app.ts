import middy from '@middy/core';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpResponseSerializer from '@middy/http-response-serializer';
import { Handler } from 'aws-lambda';

import BookRepository from '/opt/book.repository';
import APIGatewayEvent from '/opt/definitions/api-gateway-event.alias';
import APIGatewayResult from '/opt/definitions/api-gateway-result.interface';
import Book from '/opt/definitions/book.interface';
import Errors from '/opt/definitions/errors.enum';
import { buildSuccessResponse, httpResponseSerializerOptions } from '/opt/utils';

export const handler: Handler<APIGatewayEvent, APIGatewayResult<Book>> = middy(
    async (event: APIGatewayEvent): Promise<APIGatewayResult<Book>> => {
        const repo = new BookRepository();
        const book: Book = await repo.findOne(event.pathParameters.id);
        return buildSuccessResponse(book);
    }
).use([
    doNotWaitForEmptyEventLoop(),
    httpErrorHandler({ fallbackMessage: Errors.GENERAL_ERROR }),
    httpJsonBodyParser(),
    httpResponseSerializer(httpResponseSerializerOptions)
]);
