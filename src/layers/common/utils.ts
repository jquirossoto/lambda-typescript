import APIGatewayProxyResult from './definitions/api-gateway-proxy-result.interface';
import APIGatewayResponse from './definitions/api-gateway-response.interface';

export const buildSuccessReponse = (
    result: any,
    statusCode?: number
): APIGatewayProxyResult<APIGatewayResponse<any>> => {
    const response: APIGatewayProxyResult<APIGatewayResponse<any>> = {
        statusCode: statusCode || 200,
        body: {
            status: 'SUCCESS',
            result: result
        }
    };
    return response;
};
