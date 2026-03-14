import { Router } from 'express';
import { z } from 'zod';
import {
  listEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
  bulkCreateEntities,
} from '../services/entityService.js';

const router = Router();

const payloadSchema = z.record(z.any());

router.get('/:resource', async (req, res, next) => {
  try {
    const data = await listEntities(req.params.resource, { params: req.query });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/:resource/:id', async (req, res, next) => {
  try {
    const data = await getEntity(req.params.resource, req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/:resource', async (req, res, next) => {
  try {
    const payload = payloadSchema.parse(req.body);
    const data = await createEntity(req.params.resource, payload);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/:resource/bulk', async (req, res, next) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const parsed = items.map((item) => payloadSchema.parse(item));
    const data = await bulkCreateEntities(req.params.resource, parsed);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

router.put('/:resource/:id', async (req, res, next) => {
  try {
    const payload = payloadSchema.parse(req.body);
    const data = await updateEntity(req.params.resource, req.params.id, payload);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.delete('/:resource/:id', async (req, res, next) => {
  try {
    await deleteEntity(req.params.resource, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
