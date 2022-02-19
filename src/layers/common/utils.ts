import APIGatewayProxyResult from './definitions/api-gateway-proxy-result.interface';
import APIGatewayResponse from './definitions/api-gateway-response.interface';

export const buildSuccessReponse = (result: any, statusCode: number = 200): APIGatewayProxyResult<any> => {
    const response: APIGatewayProxyResult<APIGatewayResponse<any>> = {
        statusCode: statusCode,
        body: {
            status: 'SUCCESS',
            result: result
        }
    };
    return response;
};

export const buildErrorResponse = (errors: string[], statusCode: number = 500): APIGatewayProxyResult<any> => {
    const response: APIGatewayProxyResult<APIGatewayResponse<any>> = {
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
