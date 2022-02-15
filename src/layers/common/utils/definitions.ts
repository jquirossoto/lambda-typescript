import { APIGatewayEvent } from 'aws-lambda';

export interface Book {
    id?: string;
    title: string;
    genre: string;
    author: string;
}

export type CustomAPIGatewayEvent<T> = APIGatewayEvent & {
    body: T;
};

export enum Errors {
    GENERAL_ERROR = 'Error while processing the request.'
}
