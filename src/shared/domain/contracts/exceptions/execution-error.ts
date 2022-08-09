// @todo to be implemented
export type ExecutionError<T> = {
  code: T;
  message: string;
  data?: Record<string, any>;
};
