import { APIGatewayEvent as AWSAPIGatewayEvent, APIGatewayProxyResult as AWSAPIGatewayProxyResult } from 'aws-lambda';

export interface Book {
    id?: string;
    title: string;
    genre: string;
    author: string;
}

export type APIGatewayEvent<T> = AWSAPIGatewayEvent & {
    body: T;
};

export interface APIGatewayResponse<T> {
    status: string;
    result: T;
}

export interface APIGatewayProxyResult<T> extends Omit<AWSAPIGatewayProxyResult, 'body'> {
    body: T;
}

export enum Errors {
    GENERAL_ERROR = 'Error while processing the request.'
}
