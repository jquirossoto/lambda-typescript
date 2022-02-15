export const buildSuccessReponse = (result: any, statusCode?: number) => {
    return {
        statusCode: statusCode || 200,
        body: {
            status: 'SUCCESS',
            result: result
        }
    };
};
