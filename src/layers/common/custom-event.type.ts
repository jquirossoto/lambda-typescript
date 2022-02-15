import { APIGatewayEvent } from 'aws-lambda';

export type CustomAPIGatewayEvent<T> = APIGatewayEvent & {
    body: T;
};
