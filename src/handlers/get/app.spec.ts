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
        it('Should return 200 with the found book', async () => {
            const id: string = uuid();
            const event: APIGatewayEvent<Book> = {
                pathParameters: {
                    id: id
                }
            } as any;
            const foundBook: Book = {
                id: id,
                title: 'Found book',
                genre: 'Fiction',
                author: 'John Doe'
            };
            const context: Context = {} as any;
            mockedRepo.findOne.mockResolvedValue(foundBook);

            const result = (await handler(event, context, null)) as unknown as APIGatewayResult;

            const response: APIGatewayResponse<Book> = JSON.parse(result.body as unknown as string);
            expect(mockedRepo.findOne).toHaveBeenCalledWith(id);
            expect(result.statusCode).toBe(200);
            expect(response.status).toBe(Statuses.SUCCESS);
            expect(response.result).toEqual(foundBook);
        });

        it('Should return 404 error with an error message', async () => {
            const id: string = uuid();
            const event: APIGatewayEvent<Book> = {
                pathParameters: {
                    id: id
                }
            } as any;
            const context: Context = {} as any;
            mockedRepo.findOne.mockRejectedValue(new NotFound(Errors.NOT_FOUND));

            const result = (await handler(event, context, null)) as unknown as APIGatewayResult;

            const response: APIGatewayResponse<Book> = JSON.parse(result.body as unknown as string);
            expect(mockedRepo.findOne).toHaveBeenCalledWith(id);
            expect(result.statusCode).toBe(404);
            expect(response.status).toBe(Statuses.ERROR);
            expect(response.result).toEqual(Errors.NOT_FOUND);
        });

        it('Should return default 500 error with an error message', async () => {
            const id: string = uuid();
            const event: APIGatewayEvent<Book> = {
                pathParameters: {
                    id: id
                }
            } as any;
            const context: Context = {} as any;
            mockedRepo.findOne.mockRejectedValue(new Error());

            const result = (await handler(event, context, null)) as unknown as APIGatewayResult;

            const response: APIGatewayResponse<Book> = JSON.parse(result.body as unknown as string);
            expect(mockedRepo.findOne).toHaveBeenCalledWith(id);
            expect(result.statusCode).toBe(500);
            expect(response.status).toBe(Statuses.ERROR);
            expect(response.result).toEqual(Errors.GENERAL_ERROR);
        });
    });
});
