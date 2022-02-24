import { on } from '@jurijzahn8019/aws-promise-jest-mock';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

import { create } from './book.repository';
import Book from './definitions/book.interface';

jest.mock('aws-sdk');

describe('Book Repository', () => {
    describe('Create', () => {
        it('Should create a book', async () => {
            const id: string = uuid();
            const newBook: Book = {
                title: 'New book',
                genre: 'Fiction',
                author: 'John Doe'
            };
            const createdBook: Book = {
                id: id,
                ...newBook
            };
            const updatedItem: DynamoDB.DocumentClient.UpdateItemOutput = {
                Attributes: {
                    bookId: id,
                    title: 'New book',
                    genre: 'Fiction',
                    author: 'John Doe'
                }
            };
            on(DynamoDB.DocumentClient).mock('update').resolve(updatedItem);

            const returned: Book = await create(newBook);

            expect(returned).toEqual(createdBook);
        });
    });
});
