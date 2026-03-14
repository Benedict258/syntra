import { apiClient, authToken } from './httpClient';

const LOGIN_PATH = import.meta.env.VITE_LOGIN_URL || '/login';

export const authApi = {
  async getCurrentUser() {
    return apiClient.get('/auth/me');
  },

  async login(credentials) {
    const result = await apiClient.post('/auth/login', credentials);
    if (result?.token) {
      authToken.set(result.token);
    }
    return result;
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Network logout failures should not block client cleanup
      console.warn('Logout request failed', error);
    }
    authToken.clear();
  },

  setSessionToken(token) {
    authToken.set(token);
  },

  redirectToLogin(returnTo) {
    if (typeof window === 'undefined') {
      return;
    }
    const redirectTarget = returnTo || window.location.href;
    const loginUrl = new URL(LOGIN_PATH, window.location.origin);
    if (redirectTarget) {
      loginUrl.searchParams.set('redirect', redirectTarget);
    }
    window.location.href = loginUrl.toString();
  }
};
