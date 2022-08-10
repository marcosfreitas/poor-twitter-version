import { ErrorCodes } from '../exceptions/error-codes';

export type ExecutionResult<D = Record<string, any>, C = ErrorCodes> = {
  code?: C;
  message?: string;
  data: D;
};
