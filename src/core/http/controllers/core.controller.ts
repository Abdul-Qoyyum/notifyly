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
      typeof error === 'object' && error !== null ? { ...error } : { error };
    const statusCode =
      typeof error === 'object' && error !== null && 'statusCode' in error
        ? (error as { statusCode?: number }).statusCode
        : undefined;

    return this.errorResponse(message, data, statusCode);
  }
}

export default CoreController;
