import { StatusCodes } from 'http-status-codes';

abstract class CoreController {
  successResponse(
    message: string,
    data?: Record<string, any> | null,
    statusCode = StatusCodes.OK,
  ) {
    return { success: true, statusCode, message, data };
  }

  errorResponse(
    message: string,
    data?: Record<string, any> | null,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    return { success: false, statusCode, message, data };
  }

  exceptionResponse(error: unknown) {
    const message =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message?: unknown }).message)
        : 'An unexpected error occurred';
    const data =
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof error.response === 'object'
        ? error.response
        : error !== null
          ? { ...error }
          : { error };
    const statusCode =
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof error.response === 'object' &&
      error.response !== null &&
      'statusCode' in error.response
        ? (error.response.statusCode as number)
        : undefined;
    return this.errorResponse(message, data, statusCode);
  }
}

export default CoreController;
