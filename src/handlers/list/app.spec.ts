import { Context } from 'aws-lambda';
import { NotFound } from 'http-errors';
import { v4 as uuid } from 'uuid';

import * as repo from '/opt/book.repository';
import APIGatewayEvent from '/opt/definitions/api-gateway-event.alias';
import APIGatewayResponse from '/opt/definitions/api-gateway-response.interface';
import APIGatewayResult from '/opt/definitions/api-gateway-result.interface';
import Book from '/opt/definitions/book.interface';
import Errors from '/opt/definitions/errors.enum';
import Statuses from '/opt/definitions/statuses.enum';

import { handler } from './app';

jest.mock('/opt/book.repository');
const mockedRepo = jest.mocked(repo, true);

describe('Get', () => {
    describe('Handler', () => {
        it('Should return 200 with the found books', async () => {
            const event: APIGatewayEvent = {} as any;
            const context: Context = {} as any;
            const foundBooks: Book[] = [
                {
                    id: uuid(),
                    title: 'Found book 1',
                    genre: 'Fiction',
                    author: 'John Doe'
                },
                {
                    id: uuid(),
                    title: 'Found book 2',
                    genre: 'Fiction',
                    author: 'John Doe'
                }
            ];
            mockedRepo.find.mockResolvedValue(foundBooks);

            const result = (await handler(event, context, null)) as APIGatewayResult;

            const response: APIGatewayResponse<Book> = JSON.parse(result.body as unknown as string);
            expect(mockedRepo.find).toHaveBeenCalledWith();
            expect(result.statusCode).toBe(200);
            expect(response.status).toBe(Statuses.SUCCESS);
            expect(response.result).toEqual(foundBooks);
        });

        it('Should return default 500 error with an error message', async () => {
            const event: APIGatewayEvent = {} as any;
            const context: Context = {} as any;
            mockedRepo.find.mockRejectedValue(new Error());

            const result = (await handler(event, context, null)) as APIGatewayResult;

            const response: APIGatewayResponse<Book> = JSON.parse(result.body as unknown as string);
            expect(mockedRepo.find).toHaveBeenCalledWith();
            expect(result.statusCode).toBe(500);
            expect(response.status).toBe(Statuses.ERROR);
            expect(response.result).toEqual(Errors.GENERAL_ERROR);
        });
    });
});
