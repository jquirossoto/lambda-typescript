import { CustomAPIGatewayProxyResult, CustomResult } from './definitions';

export const buildSuccessReponse = (
    result: any,
    statusCode?: number
): CustomAPIGatewayProxyResult<CustomResult<any>> => {
    return {
        statusCode: statusCode || 200,
        body: {
            status: 'SUCCESS',
            result: result
        }
    };
};
