import { Context } from 'aws-lambda';
import { UnprocessableEntity } from 'http-errors';
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

describe('Create', () => {
    describe('Handler', () => {
        it('Should return 200 with the updated book.', async () => {
            const id: string = uuid();
            const dataToUpdate: Book = {
                title: 'ToBeUpdated',
                genre: 'Fiction',
                author: 'John Doe'
            };
            const updatedBook: Book = {
                id: id,
                ...dataToUpdate
            };
            const event: APIGatewayEvent<Book> = {
                pathParameters: {
                    id: id
                },
                body: dataToUpdate
            } as any;
            const context: Context = {} as any;
            mockedRepo.update.mockResolvedValue(updatedBook);

            const result = (await handler(event, context, null)) as APIGatewayResult;

            const response: APIGatewayResponse<Book> = JSON.parse(result.body as unknown as string);
            expect(mockedRepo.update).toHaveBeenCalledWith(id, dataToUpdate);
            expect(result.statusCode).toBe(200);
            expect(response.status).toBe(Statuses.SUCCESS);
            expect(response.result).toEqual(updatedBook);
        });

        it('Should return 422 error with an error message', async () => {
            const id: string = uuid();
            const dataToUpdate: Book = {
                title: 'ToBeUpdated',
                genre: 'Fiction',
                author: 'John Doe'
            };
            const event: APIGatewayEvent<Book> = {
                pathParameters: {
                    id: id
                },
                body: dataToUpdate
            } as any;
            const context: Context = {} as any;
            mockedRepo.update.mockRejectedValue(new UnprocessableEntity(Errors.UNPROCESSABLE));

            const result = (await handler(event, context, null)) as APIGatewayResult;

            const response: APIGatewayResponse<Book> = JSON.parse(result.body as unknown as string);
            expect(mockedRepo.update).toHaveBeenCalledWith(id, dataToUpdate);
            expect(result.statusCode).toBe(422);
            expect(response.status).toBe(Statuses.ERROR);
            expect(response.result).toBe(Errors.UNPROCESSABLE);
        });

        it('Should return default 500 error with an error message', async () => {
            const id: string = uuid();
            const dataToUpdate: Book = {
                title: 'ToBeUpdated',
                genre: 'Fiction',
                author: 'John Doe'
            };
            const event: APIGatewayEvent<Book> = {
                pathParameters: {
                    id: id
                },
                body: dataToUpdate
            } as any;
            const context: Context = {} as any;
            mockedRepo.update.mockRejectedValue(new Error());

            const result = (await handler(event, context, null)) as APIGatewayResult;

            const response: APIGatewayResponse<Book> = JSON.parse(result.body as unknown as string);
            expect(mockedRepo.update).toHaveBeenCalledWith(id, dataToUpdate);
            expect(result.statusCode).toBe(500);
            expect(response.status).toBe(Statuses.ERROR);
            expect(response.result).toBe(Errors.GENERAL_ERROR);
        });
    });
});
