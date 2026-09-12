export class ApiError extends Error {
  status: number;
  errors?: string[];

  constructor(message: string, status: number, errors?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

const getBaseUrl = (): string => {
  const envUrl =
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
    (import.meta.env.VITE_API_URL as string | undefined) ||
    (import.meta.env.BUN_PUBLIC_API_BASE_URL as string | undefined);

  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }
  
  // Default to localhost:8080 in dev
  return 'http://localhost:8080';
};

export const BASE_URL = getBaseUrl();

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message =
      data?.message ||
      (typeof data === 'string' ? data : null) ||
      response.statusText ||
      'An unexpected error occurred';
    const errors = Array.isArray(data?.errors) ? data.errors : undefined;

    throw new ApiError(message, response.status, errors);
  }

  return data as T;
}
