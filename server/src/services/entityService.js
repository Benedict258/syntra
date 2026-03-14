import { createSupabaseClient } from './supabaseClient.js';

const DEFAULT_RESOURCES = [
  'projects',
  'creatives',
  'artifacts',
  'branding',
  'saved-items',
  'reports',
  'run-jobs',
  'checklist-tasks',
  'agile-tasks',
  'bmc',
  'users'
];

const RESOURCE_TABLE_MAP = {
  'projects': 'projects',
  'creatives': 'creatives',
  'artifacts': 'artifacts',
  'branding': 'branding',
  'saved-items': 'saved_items',
  'reports': 'reports',
  'run-jobs': 'run_jobs',
  'checklist-tasks': 'checklist_tasks',
  'agile-tasks': 'agile_tasks',
  'bmc': 'bmc_documents',
  'users': 'users'
};

const allowedResources = (process.env.ALLOWED_ENTITY_RESOURCES || '').split(',').map((item) => item.trim()).filter(Boolean);

const isAllowedResource = (resource) => {
  if (allowedResources.length > 0) {
    return allowedResources.includes(resource);
  }
  return DEFAULT_RESOURCES.includes(resource);
};

const getTableName = (resource) => {
  if (!isAllowedResource(resource)) {
    throw new Error(`Resource ${resource} is not whitelisted`);
  }
  const table = RESOURCE_TABLE_MAP[resource];
  if (!table) {
    throw new Error(`No table mapping found for ${resource}`);
  }
  return table;
};

export const listEntities = async (resource, { params = {} } = {}) => {
  const supabase = createSupabaseClient();
  const table = getTableName(resource);
  let query = supabase.from(table).select('*');

  if (params.order) {
    const [column, direction] = params.order.startsWith('-')
      ? [params.order.slice(1), 'desc']
      : [params.order, 'asc'];
    query = query.order(column, { ascending: direction !== 'desc' });
  }

  if (params.limit) {
    query = query.limit(Number(params.limit));
  }

  if (params.project_id) {
    query = query.eq('project_id', params.project_id);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return data;
};

export const getEntity = async (resource, id) => {
  const supabase = createSupabaseClient();
  const table = getTableName(resource);
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createEntity = async (resource, payload) => {
  const supabase = createSupabaseClient();
  const table = getTableName(resource);
  const { data, error } = await supabase.from(table).insert(payload).select('*').single();
  if (error) throw error;
  return data;
};

export const updateEntity = async (resource, id, payload) => {
  const supabase = createSupabaseClient();
  const table = getTableName(resource);
  const { data, error } = await supabase.from(table).update(payload).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
};

export const deleteEntity = async (resource, id) => {
  const supabase = createSupabaseClient();
  const table = getTableName(resource);
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  return { success: true };
};

export const bulkCreateEntities = async (resource, items = []) => {
  const supabase = createSupabaseClient();
  const table = getTableName(resource);
  const { data, error } = await supabase.from(table).insert(items).select('*');
  if (error) throw error;
  return data;
};
