import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v4 as uuid } from 'uuid';

import Book from './book.model';

export class BookRepository {
  dynamodb: DocumentClient;

  constructor(dynamodb: DocumentClient) {
    this.dynamodb = dynamodb;
  }

  create = async (book: Book): Promise<Book> => {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: 'Books',
        Key: { bookId: uuid() },
        UpdateExpression: `set title = :t, genre = :g, author = :a`,
        ExpressionAttributeValues: {
          ':t': book.title,
          ':g': book.genre,
          ':a': book.author
        },
        ReturnValues: 'ALL_NEW'
      };
      this.dynamodb
        .update(params)
        .promise()
        .then((data) => {
          const createdBook: Book = {
            id: data.Attributes.bookId,
            title: data.Attributes.title,
            genre: data.Attributes.genre,
            author: data.Attributes.author
          };
          resolve(createdBook);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  get = async (id: string): Promise<Book> => {
    return new Promise((resolve, reject) => {
      const params = {
        Key: {
          bookId: id
        },
        TableName: 'Books'
      };
      this.dynamodb
        .get(params)
        .promise()
        .then((data) => {
          let book: Book = null;
          if (data.Item) {
            book = {
              id: data.Item.bookId,
              title: data.Item.title,
              genre: data.Item.genre,
              author: data.Item.author
            };
          }
          resolve(book);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
