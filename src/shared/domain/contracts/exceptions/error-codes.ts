export enum ErrorCodesDomains {
  GENERIC = 'GENERIC',
  USER = 'USER',
  POST = 'POST',
}

export enum ErrorCodes {
  UNKNOWN = 'UNKNOWN',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  COULD_NOT_CREATE_POST = 'COULD_NOT_CREATE_POST',
  COULD_NOT_RETRIEVE_USER = 'COULD_NOT_RETRIEVE_USER',
}

export type ErrorCode = keyof typeof ErrorCodes;

interface ErrorDescriptionContract {
  code: ErrorCode;
  message: string;
}

export const ERRORS: Record<
  ErrorCodesDomains,
  Record<string, ErrorDescriptionContract>
> = {
  GENERIC: {
    [ErrorCodes.UNKNOWN]: {
      code: ErrorCodes.UNKNOWN,
      message: 'Unmapped error',
    },
    [ErrorCodes.NOT_FOUND]: {
      code: ErrorCodes.NOT_FOUND,
      message: 'Not found',
    },
    [ErrorCodes.BAD_REQUEST]: {
      code: ErrorCodes.BAD_REQUEST,
      message: 'Bad request',
    },
    [ErrorCodes.INTERNAL_SERVER_ERROR]: {
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    },
  },
  POST: {
    [ErrorCodes.COULD_NOT_CREATE_POST]: {
      code: 'COULD_NOT_CREATE_POST',
      message: 'Could not create post',
    },
  },
  USER: {
    [ErrorCodes.COULD_NOT_RETRIEVE_USER]: {
      code: 'COULD_NOT_RETRIEVE_USER',
      message: 'Could not retrieve user',
    },
  },
};
