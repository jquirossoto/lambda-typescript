import { CustomAPIGatewayProxyResult, APIGatewayResponse } from './definitions';

export const buildSuccessReponse = (
    result: any,
    statusCode?: number
): CustomAPIGatewayProxyResult<APIGatewayResponse<any>> => {
    const response: CustomAPIGatewayProxyResult<APIGatewayResponse<any>> = {
        statusCode: statusCode || 200,
        body: {
            status: 'SUCCESS',
            result: result
        }
    };
    return response;
};
