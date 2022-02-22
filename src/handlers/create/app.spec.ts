import { Context } from 'aws-lambda';
import { UnprocessableEntity } from 'http-errors';
import { v4 as uuid } from 'uuid';

import * as repo from '/opt/book.repository';
import APIGatewayEvent from '/opt/definitions/api-gateway-event.alias';
import APIGatewayResponse from '/opt/definitions/api-gateway-response.interface';
import APIGatewayResult from '/opt/definitions/api-gateway-result.interface';
import Book from '/opt/definitions/book.interface';
import Errors from '/opt/definitions/errors.enum';

import Statuses from '../../layers/common/definitions/statuses.enum';
import { handler } from './app';

jest.mock('/opt/book.repository');
const mockedRepo = jest.mocked(repo, true);

describe('Create', () => {
    describe('Handler', () => {
        it('Should return 200 with a created book.', async () => {
            const newBook: Book = {
                title: 'New book',
                genre: 'Fiction',
                author: 'John Doe'
            };
            const createdBook: Book = {
                id: uuid(),
                ...newBook
            };
            const event: APIGatewayEvent<Book> = {
                body: newBook
            } as any;
            const context: Context = {} as any;
            mockedRepo.create.mockResolvedValue(createdBook);

            const result = (await handler(event, context, null)) as APIGatewayResult;

            const response: APIGatewayResponse<Book> = JSON.parse(result.body as unknown as string);
            expect(result.statusCode).toBe(200);
            expect(response.status).toBe(Statuses.SUCCESS);
            expect(response.result).toEqual(createdBook);
        });

        it('Should return 422 error with an error message', async () => {
            const newBook: Book = {
                title: 'New book',
                genre: 'Fiction',
                author: 'John Doe'
            };
            const event: APIGatewayEvent<Book> = {
                body: newBook
            } as any;
            const context: Context = {} as any;
            mockedRepo.create.mockRejectedValue(new UnprocessableEntity(Errors.UNPROCESSABLE));

            const result = (await handler(event, context, null)) as APIGatewayResult;

            const response: APIGatewayResponse<Book> = JSON.parse(result.body as unknown as string);
            expect(result.statusCode).toBe(422);
            expect(response.status).toBe(Statuses.ERROR);
            expect(response.result).toBe(Errors.UNPROCESSABLE);
        });

        it('Should return default 500 error with an error message', async () => {
            const newBook: Book = {
                title: 'New book',
                genre: 'Fiction',
                author: 'John Doe'
            };
            const event: APIGatewayEvent<Book> = {
                body: newBook
            } as any;
            const context: Context = {} as any;
            mockedRepo.create.mockRejectedValue(new Error());

            const result = (await handler(event, context, null)) as APIGatewayResult;

            const response: APIGatewayResponse<Book> = JSON.parse(result.body as unknown as string);
            expect(result.statusCode).toBe(500);
            expect(response.status).toBe(Statuses.ERROR);
            expect(response.result).toBe(Errors.GENERAL_ERROR);
        });
    });
});
