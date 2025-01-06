import type { ErrorType } from '../types';

type MaybeError = {
  data?: string;
  error?: string;
  originalStatus?: number;
  status?: string;
};

const networkError = 'It looks like you lost your internet connection. Please reload this page and try again.';
const notFoundError = 'Some data requested by this page could not be loaded.';
const serverError = 'Something went wrong on the server.';

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
    console.error(e);
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
};

const toErrorObject = (error: unknown): ErrorType =>
  JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));

const looksLikeJSON = (message: string): boolean => message.startsWith('{"');

export const getError = (maybeError: MaybeError): ErrorType => {
  const errorObject = toErrorObject(toErrorWithMessage(maybeError));
  const error: ErrorType = {
    message: errorObject.message,
    status: errorObject.status,
  };

  if (!error.status && 'originalStatus' in maybeError) {
    error.status = maybeError.originalStatus;
  }

  if (looksLikeJSON(error.message)) {
    const messageObject = JSON.parse(error.message);

    if ('error' in messageObject) {
      error.message = messageObject.error;
    }
  }

  if (error.message.includes('NetworkError')) {
    error.customMessage = networkError;
  } else if (error.status === 500) {
    error.customMessage = serverError;
  } else if (error.status === 404) {
    error.customMessage = notFoundError;
  }

  return error;
};
