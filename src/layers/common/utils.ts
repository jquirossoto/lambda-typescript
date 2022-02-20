import * as httpErrors from 'http-errors';

import APIGatewayResponse from './definitions/api-gateway-response.interface';
import APIGatewayResult from './definitions/api-gateway-result.interface';
import Errors from './definitions/errors.enum';
import logger from './logger';

export const buildSuccessResponse = (result: any, statusCode: number = 200): APIGatewayResult<any> => {
    const response: APIGatewayResult<APIGatewayResponse<any>> = {
        statusCode: statusCode,
        body: {
            status: 'SUCCESS',
            result: result
        }
    };
    return response;
};

export const buildErrorResponse = (result: any, statusCode: number = 500): APIGatewayResult<any> => {
    const response: APIGatewayResult<APIGatewayResponse<any>> = {
        statusCode: statusCode,
        body: {
            status: 'ERROR',
            result: result
        }
    };
    return response;
};

export const httpResponseSerializerOptions = {
    serializers: [
        {
            regex: /^application\/json$/,
            serializer: ({ body }) => JSON.stringify(body)
        }
    ],
    default: 'application/json'
};

export const dynamoDBErrorHandler = (err: AWS.AWSError): Error => {
    let result: Error;
    if (err.code === 'ResourceNotFoundException') {
        result = new httpErrors.NotFound(Errors.NOT_FOUND);
    } else if (err.code === 'AccessDeniedException') {
        result = new httpErrors.InternalServerError(Errors.GENERAL_ERROR);
    } else {
        result = err;
    }
    return result;
};
