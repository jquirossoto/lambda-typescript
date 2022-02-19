import AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v4 as uuid } from 'uuid';

import Book from './definitions/book.interface';

const TABLE_NAME = 'Books';

export default class BookRepository {
    dynamodb: DocumentClient;

    constructor() {
        this.dynamodb = new AWS.DynamoDB.DocumentClient({
            endpoint: new AWS.Endpoint('http://dynamodb:8000'),
            region: 'us-east-1'
        });
    }

    create = (book: Book): Promise<Book> => {
        return new Promise((resolve, reject) => {
            const params: DocumentClient.UpdateItemInput = {
                TableName: TABLE_NAME,
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
                .then((data: DocumentClient.UpdateItemOutput) => {
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

    findOne = (id: string): Promise<Book> => {
        return new Promise((resolve, reject) => {
            const params: DocumentClient.GetItemInput = {
                Key: {
                    bookId: id
                },
                TableName: TABLE_NAME
            };
            this.dynamodb
                .get(params)
                .promise()
                .then((data: DocumentClient.GetItemOutput) => {
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

    find = (): Promise<Book[]> => {
        return new Promise(async (resolve, reject) => {
            try {
                const params: DocumentClient.ScanInput = {
                    TableName: TABLE_NAME,
                    ExclusiveStartKey: undefined
                };
                const scanResults: DocumentClient.ItemList = [];
                let items: DocumentClient.ScanOutput;
                do {
                    items = await this.dynamodb.scan(params).promise();
                    items.Items.forEach((item) => scanResults.push(item));
                    params.ExclusiveStartKey = items.LastEvaluatedKey;
                } while (typeof items.LastEvaluatedKey !== 'undefined');
                const books: Book[] = scanResults.map((item: DocumentClient.AttributeMap) => {
                    const book: Book = {
                        id: item.bookId,
                        title: item.title,
                        genre: item.genre,
                        author: item.author
                    };
                    return book;
                });
                resolve(books);
            } catch (error) {
                reject(error);
            }
        });
    };

    update = (id: string, book: Book): Promise<Book> => {
        return new Promise((resolve, reject) => {
            const params: DocumentClient.UpdateItemInput = {
                TableName: TABLE_NAME,
                Key: { bookId: id },
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
                .then((data: DocumentClient.UpdateItemOutput) => {
                    const updatedBook: Book = {
                        id: data.Attributes.bookId,
                        title: data.Attributes.title,
                        genre: data.Attributes.genre,
                        author: data.Attributes.author
                    };
                    resolve(updatedBook);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    delete = (id: string): Promise<null> => {
        return new Promise((resolve, reject) => {
            const params: DocumentClient.DeleteItemInput = {
                TableName: TABLE_NAME,
                Key: { bookId: id }
            };
            this.dynamodb
                .delete(params)
                .promise()
                .then(() => {
                    resolve(null);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };
}
