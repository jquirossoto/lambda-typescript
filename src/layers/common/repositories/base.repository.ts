import AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export default abstract class BaseRepository<T> {
    static dynamodb: DocumentClient = new AWS.DynamoDB.DocumentClient({
        endpoint: new AWS.Endpoint('http://dynamodb:8000'),
        region: 'us-east-1'
    });

    create(item: T): Promise<T> {
        throw new Error('Method not implemented.');
    }
    update(id: string, item: T): Promise<T> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<T> {
        throw new Error('Method not implemented.');
    }
    get(id: string): Promise<T[]> {
        throw new Error('Method not implemented.');
    }
    list(): Promise<T> {
        throw new Error('Method not implemented.');
    }
}
