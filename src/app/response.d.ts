export type TResponse = {
    statusCode: number;
    message?: string | null;
    success: boolean;
    data?: unknown | null;
};