export const errorHandler = (statusCode: number, message: string) => {
    const error = new Error() as any;
    error.statusCode = statusCode;
    error.message = message;
    return error;
};
