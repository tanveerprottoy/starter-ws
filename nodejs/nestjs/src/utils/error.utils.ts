import { HttpException, HttpStatus } from "@nestjs/common";
import { Constants } from "./constants";

export class ErrorUtils {

    static throwError(
        error: Error
    ): Error {
        throw error;
    }

    static throwErrorWithMessage(
        message: string = Constants.GENERIC_ERROR
    ): Error {
        throw new Error(message);
    }

    static throwHttpError(
        message: string = Constants.GENERIC_ERROR,
        status: number = HttpStatus.INTERNAL_SERVER_ERROR,
    ): HttpException {
        throw new HttpException(
            message,
            status
        );
    }
}