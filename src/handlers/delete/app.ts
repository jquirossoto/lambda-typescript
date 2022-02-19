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

export const handler: Handler<APIGatewayEvent, APIGatewayProxyResult<Book>> = middy(
    async (event: APIGatewayEvent): Promise<APIGatewayProxyResult<Book>> => {
        const repo = new BookRepository();
        await repo.delete(event.pathParameters.id);
        return buildSuccessResponse(null);
    }
).use([
    doNotWaitForEmptyEventLoop(),
    httpErrorHandler({ fallbackMessage: Errors.GENERAL_ERROR }),
    httpJsonBodyParser(),
    httpResponseSerializer(httpResponseSerializerOptions)
]);
