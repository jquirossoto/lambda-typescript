import { APIGatewayEvent as AWSAPIGatewayEvent } from 'aws-lambda';

type APIGatewayEvent<T> = AWSAPIGatewayEvent & {
    body: T;
};

export default APIGatewayEvent;
