import { createSupabaseClient } from './supabaseClient.js';

export const recordNavigationEvent = async ({ userId, path, referrer, metadata }) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('navigation_events')
    .insert({
      user_id: userId,
      path,
      referrer,
      metadata,
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }
  return data;
};
