import { NotFound, UnprocessableEntity, InternalServerError, HttpError } from 'http-errors';

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

export const dynamoDBErrorHandler = (error: AWS.AWSError): HttpError => {
    logger.error(error);
    let result: HttpError;
    if (error.statusCode < 500) {
        switch (error.code) {
            case 'ResourceNotFoundException':
                result = new NotFound(Errors.NOT_FOUND);
                break;
            case 'ValidationException':
                result = new UnprocessableEntity(Errors.UNPROCESSABLE);
                break;
            case 'ConditionalCheckFailedException':
            case 'AccessDeniedException':
            case 'IncompleteSignatureException':
            case 'ItemCollectionSizeLimitExceededException':
            case 'LimitExceededException':
            case 'MissingAuthenticationTokenException':
            case 'ProvisionedThroughputExceededException':
            case 'RequestLimitExceeded':
            case 'ResourceInUseException':
            case 'ThrottlingException':
            case 'UnrecognizedClientException':
            default:
                result = new InternalServerError(Errors.GENERAL_ERROR);
                break;
        }
    } else {
        result = new InternalServerError(Errors.GENERAL_ERROR);
    }
    return result;
};
