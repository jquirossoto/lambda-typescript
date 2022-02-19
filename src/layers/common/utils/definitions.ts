import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

export interface Book {
    id?: string;
    title: string;
    genre: string;
    author: string;
}

export type CustomAPIGatewayEvent<T> = APIGatewayEvent & {
    body: T;
};

export interface APIGatewayResponse<T> {
    status: string;
    result: T;
}

export interface CustomAPIGatewayProxyResult<T> extends Omit<APIGatewayProxyResult, 'body'> {
    body: T;
}

export enum Errors {
    GENERAL_ERROR = 'Error while processing the request.'
}
