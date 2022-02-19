export default interface APIGatewayResponse<T> {
    status: string;
    result?: T;
    errors?: string[];
}
