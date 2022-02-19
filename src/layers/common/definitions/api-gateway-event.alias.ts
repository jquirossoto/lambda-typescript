import { APIGatewayEvent as AWSAPIGatewayEvent } from 'aws-lambda';

type APIGatewayEvent<T = string | null> = AWSAPIGatewayEvent & {
    body: T;
};

export default APIGatewayEvent;
