import middy from '@middy/core';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpResponseSerializer from '@middy/http-response-serializer';
import { APIGatewayEvent, Handler } from 'aws-lambda';

import BookRepository from '/opt/book.repository';
import APIGatewayProxyResult from '/opt/definitions/api-gateway-proxy-result.interface';
import Book from '/opt/definitions/book.interface';
import Errors from '/opt/definitions/errors.enum';
import { buildSuccessReponse, httpResponseSerializerOptions } from '/opt/utils';

export const handler: Handler<APIGatewayEvent, APIGatewayProxyResult<Book>> = middy(
    async (event: APIGatewayEvent): Promise<APIGatewayProxyResult<Book>> => {
        const repo = new BookRepository();
        const books: Book[] = await repo.find();
        return buildSuccessReponse(books);
    }
).use([
    doNotWaitForEmptyEventLoop(),
    httpErrorHandler({ fallbackMessage: Errors.GENERAL_ERROR }),
    httpJsonBodyParser(),
    httpResponseSerializer(httpResponseSerializerOptions)
]);
