import type { ErrorType } from '../types';

const networkError = 'It looks like you lost your internet connection. Please reload this page and try again.';
const notFoundError = 'Some data requested by this page could not be loaded.';

// adapted from https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript

const isErrorWithMessage = (error: unknown): error is ErrorType => (
  typeof error === 'object' &&
  error !== null &&
  'message' in error &&
  typeof (error as Record<string, unknown>).message === 'string'
);

const toErrorWithMessage = (maybeError: unknown): ErrorType => {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch (e) {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
};

const toErrorObject = (error: unknown): ErrorType =>
  JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));

export const getError = (maybeError: unknown): ErrorType => {
  const errorObject = toErrorObject(toErrorWithMessage(maybeError));
  let error: ErrorType = {
    message: errorObject.message,
    status: errorObject.status,
  };

  if (error.message.includes('NetworkError')) {
    error = { ...error, customMessage: networkError };
  } else if (error.status === 404) {
    error = { ...error, customMessage: notFoundError };
  }

  return error;
};
