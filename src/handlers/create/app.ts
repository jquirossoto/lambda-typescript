import middy from '@middy/core';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpResponseSerializer from '@middy/http-response-serializer';
import { Handler } from 'aws-lambda';

import BookRepository from '/opt/book.repository';
import APIGatewayEvent from '/opt/definitions/api-gateway-event.alias';
import APIGatewayProxyResult from '/opt/definitions/api-gateway-proxy-result.interface';
import Book from '/opt/definitions/book.interface';
import Errors from '/opt/definitions/errors.enum';
import { buildSuccessResponse, httpResponseSerializerOptions } from '/opt/utils';

export const handler: Handler<APIGatewayEvent<Book>, APIGatewayProxyResult<Book>> = middy(
    async (event: APIGatewayEvent<Book>): Promise<APIGatewayProxyResult<Book>> => {
        const repo = new BookRepository();
        const book: Book = await repo.create(event.body);
        return buildSuccessResponse(book);
    }
).use([
    doNotWaitForEmptyEventLoop(),
    httpJsonBodyParser(),
    httpErrorHandler({ fallbackMessage: Errors.GENERAL_ERROR }),
    httpResponseSerializer(httpResponseSerializerOptions)
]);
