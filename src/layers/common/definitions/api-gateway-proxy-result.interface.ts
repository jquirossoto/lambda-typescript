import { APIGatewayProxyResult as AWSAPIGatewayProxyResult } from 'aws-lambda';

export default interface APIGatewayProxyResult<T> extends Omit<AWSAPIGatewayProxyResult, 'body'> {
    body: T;
}
