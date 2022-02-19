import APIGatewayResponse from './definitions/api-gateway-response.interface';
import APIGatewayResult from './definitions/api-gateway-result.interface';

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

export const buildErrorResponse = (errors: string[], statusCode: number = 500): APIGatewayResult<any> => {
    const response: APIGatewayResult<APIGatewayResponse<any>> = {
        statusCode: statusCode,
        body: {
            status: 'ERROR',
            errors: errors
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
