import axios from "axios";

type ApiErrorResponse = {
  success?: boolean;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const message =
      error.response?.data?.error?.message;

    if (message) {
      return message;
    }

    if (!error.response) {
      return "Unable to connect to the server. Please try again.";
    }
  }

  return fallback;
}