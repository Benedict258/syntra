import { apiClient } from './httpClient';

export const invokeAI = async ({
  prompt,
  responseSchema,
  response_json_schema,
  addContextFromInternet,
  add_context_from_internet,
  attachments = [],
  variables = {},
}) => {
  const payload = {
    prompt,
    schema: responseSchema || response_json_schema,
    useWebSearch: addContextFromInternet ?? add_context_from_internet ?? false,
    attachments,
    variables,
  };

  const result = await apiClient.post('/ai/invoke', payload);
  return result?.result ?? result;
};
