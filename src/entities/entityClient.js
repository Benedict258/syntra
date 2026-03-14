import { apiClient } from '@/api/httpClient';

const normalizeParams = (params = {}) => {
  if (typeof params === 'string') {
    return { order: params };
  }
  return params;
};

export const createEntityClient = (resourcePath) => {
  const basePath = `/entities/${resourcePath}`;

  return {
    list(orderOrParams) {
      const params = normalizeParams(orderOrParams);
      return apiClient.get(basePath, { params });
    },

    get(id) {
      return apiClient.get(`${basePath}/${id}`);
    },

    create(payload) {
      return apiClient.post(basePath, payload);
    },

    update(id, payload) {
      return apiClient.put(`${basePath}/${id}`, payload);
    },

    delete(id) {
      return apiClient.delete(`${basePath}/${id}`);
    },

    filter(params = {}) {
      return apiClient.get(basePath, { params });
    },

    bulkCreate(items = []) {
      return apiClient.post(`${basePath}/bulk`, { items });
    }
  };
};
