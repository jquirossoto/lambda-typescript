import { APIGatewayProxyResult as AWSAPIGatewayProxyResult } from 'aws-lambda';

import APIGatewayResponse from './api-gateway-response.interface';

export default interface APIGatewayProxyResult<T> extends Omit<AWSAPIGatewayProxyResult, 'body'> {
    body: APIGatewayResponse<T>;
}
