import { createEntityClient } from './entityClient';
import { apiClient } from '@/api/httpClient';

const client = createEntityClient('users');

client.me = () => apiClient.get('/auth/me');

export const User = client;

export default User;
