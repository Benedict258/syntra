const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? window.__SYNTRA_API_BASE_URL : undefined) || 'http://localhost:4000';
const TOKEN_STORAGE_KEY = 'syntra_access_token';

let cachedToken = null;

/**
 * @typedef {Object} RequestOptions
 * @property {any} [body]
 * @property {Record<string, any>} [params]
 * @property {HeadersInit} [headers]
 * @property {AbortSignal} [signal]
 */

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const getStoredToken = () => {
  if (cachedToken) {
    return cachedToken;
  }
  if (typeof window === 'undefined') {
    return null;
  }
  cachedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  return cachedToken;
};

const persistToken = (token) => {
  if (typeof window === 'undefined') {
    cachedToken = token;
    return;
  }
  if (!token) {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } else {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
  cachedToken = token;
};

export const authToken = {
  get: () => getStoredToken(),
  set: (token) => persistToken(token),
  clear: () => persistToken(null),
};

const toQueryString = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => search.append(key, item));
    } else {
      search.append(key, value);
    }
  });
  const query = search.toString();
  return query ? `?${query}` : '';
};

const buildUrl = (path, params) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    const qs = toQueryString(params);
    return `${path}${qs}`;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const qs = toQueryString(params);
  return `${DEFAULT_BASE_URL}${normalizedPath}${qs}`;
};

/**
 * @param {'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD'} method
 * @param {string} path
 * @param {RequestOptions} [options]
 */
const request = async (method, path, options = {}) => {
  const { body, params, headers = {}, signal } = options;
  const url = buildUrl(path, params);
  const requestHeaders = new Headers(headers);

  if (!(body instanceof FormData) && method !== 'GET' && method !== 'HEAD' && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const token = authToken.get();
  if (token && !requestHeaders.has('Authorization')) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body == null || method === 'GET' || method === 'HEAD'
      ? undefined
      : body instanceof FormData
        ? body
        : JSON.stringify(body),
    signal,
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  let data = null;
  if (isJson) {
    data = await response.json().catch(() => null);
  } else {
    const text = await response.text().catch(() => '');
    data = text;
  }

  if (!response.ok) {
    throw new ApiError(response.statusText || 'Request failed', response.status, data);
  }

  return data;
};

export const apiClient = {
  /** @param {RequestOptions} [options] */
  get: (path, options) => request('GET', path, options),
  /** @param {RequestOptions} [options] */
  post: (path, body, options = {}) => request('POST', path, { ...options, body }),
  /** @param {RequestOptions} [options] */
  put: (path, body, options = {}) => request('PUT', path, { ...options, body }),
  /** @param {RequestOptions} [options] */
  patch: (path, body, options = {}) => request('PATCH', path, { ...options, body }),
  /** @param {RequestOptions} [options] */
  delete: (path, options) => request('DELETE', path, options),
};

export const apiBaseUrl = DEFAULT_BASE_URL;

export { ApiError };
