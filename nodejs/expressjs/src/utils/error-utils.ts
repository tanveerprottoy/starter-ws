export class ErrorUtils {

    static throwError(
        error: Error | unknown
    ): Error {
        throw error;
    }
}