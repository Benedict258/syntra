import { Router } from 'express';
import { z } from 'zod';
import { invokeAI as invokeAIService } from '../services/aiService.js';

const router = Router();

const payloadSchema = z.object({
  prompt: z.string(),
  schema: z.record(z.any()).optional(),
  response_json_schema: z.record(z.any()).optional(),
  responseSchema: z.record(z.any()).optional(),
  addContextFromInternet: z.boolean().optional(),
  add_context_from_internet: z.boolean().optional(),
  attachments: z.array(z.record(z.any())).optional(),
  variables: z.record(z.any()).optional(),
});

router.post('/invoke', async (req, res, next) => {
  try {
    const payload = payloadSchema.parse(req.body);
    const schema = payload.schema || payload.response_json_schema || payload.responseSchema;
    const useWebSearch = payload.addContextFromInternet ?? payload.add_context_from_internet ?? false;
    const result = await invokeAIService({
      prompt: payload.prompt,
      schema,
      useWebSearch,
      attachments: payload.attachments,
      variables: payload.variables,
    });
    res.json({ result });
  } catch (error) {
    next(error);
  }
});

export default router;
