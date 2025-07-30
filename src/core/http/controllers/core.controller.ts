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
    if (typeof error === 'object' && error !== null && 'response' in error) {
      return error.response;
    }
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: 'Internal Server Error',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
}

export default CoreController;
