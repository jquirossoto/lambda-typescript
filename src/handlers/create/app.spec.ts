import { Context } from 'aws-lambda';
import { v4 as uuid } from 'uuid';

import * as repo from '/opt/book.repository';
import APIGatewayEvent from '/opt/definitions/api-gateway-event.alias';
import APIGatewayResponse from '/opt/definitions/api-gateway-response.interface';
import APIGatewayResult from '/opt/definitions/api-gateway-result.interface';
import Book from '/opt/definitions/book.interface';

import { handler } from './app';

jest.mock('/opt/book.repository');

const mockedRepo = jest.mocked(repo, true);

// const MockedBookRepository = BookRepository as jest.Mocked<typeof BookRepository>;
// const mockBookRepository = new MockedBookRepository() as jest.Mocked<BookRepository>;

// const MockedBookRepository = <jest.Mock<BookRepository>>BookRepository;
//             const mockedBookRepository = <jest.Mocked<BookRepository>> new MockedBookRepository();

describe('Create', () => {
    describe('Handler', () => {
        it('Should return 200 with a created book.', async () => {
            debugger;
            const newBook: Book = {
                title: 'My book',
                genre: 'Fiction',
                author: 'John Doe'
            };
            const event: APIGatewayEvent<Book> = {
                body: newBook
            } as any;
            const createdBook: Book = {
                id: uuid(),
                ...newBook
            };
            const context: Context = {} as any;
            mockedRepo.create.mockResolvedValue(createdBook);

            const result = (await handler(event, context, null)) as APIGatewayResult<Book>;
            const body: APIGatewayResponse<Book> = JSON.parse(
                result.body as unknown as string
            ) as APIGatewayResponse<Book>;

            expect(result.statusCode).toBe(200);
            expect(body.result).toEqual(createdBook);
        });
    });
});
