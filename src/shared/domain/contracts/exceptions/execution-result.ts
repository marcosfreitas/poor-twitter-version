import { ExecutionError } from './execution-error';
// @todo to be implemented
export type ExecutionResult<D, E = any> = {
  error?: ExecutionError<E>;
  data: D;
};
