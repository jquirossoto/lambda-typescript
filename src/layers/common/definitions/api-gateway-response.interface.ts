export default interface APIGatewayResponse<T> {
    status: string;
    result: T;
}
