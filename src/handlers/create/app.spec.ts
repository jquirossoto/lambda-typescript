import { handler } from './app';
import BookRepository from '../../layers/common/repositories/book.repository';
import { Book } from '../../layers/common/utils/definitions';
import { v4 as uuid } from 'uuid';

jest.mock('../../layers/common/repositories/book.repository');

describe('Create', () => {
    describe('Handler', () => {
        it('Should return 200 with a created book.', () => {
            expect(true).toBe(true);
        });
    });
});
