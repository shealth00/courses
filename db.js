// db.js — Supabase client for the USMLE Illustration Portfolio backend.
//
// Env vars expected (Hostinger sets SUPABASE_URL / SUPABASE_ANON_KEY automatically
// once the project is linked; for local dev, copy .env.example to .env):
//   SUPABASE_URL       - your project's API URL
//   SUPABASE_ANON_KEY  - public anon key (safe for client-side use with RLS on)
//   SUPABASE_SERVICE_KEY (optional) - service role key, server-side only, used by
//                          scripts/seed.js and any admin-only route. NEVER expose
//                          this to the browser.

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '[db.js] SUPABASE_URL / SUPABASE_ANON_KEY are not set. ' +
    'Set them in your .env file locally, or as environment variables in your ' +
    'Hostinger app settings (they are added automatically once the app is ' +
    'connected to a Supabase project).'
  );
}

// Client for normal reads — respects Row Level Security policies (see
// supabase/schema.sql). Use this everywhere except one-off admin scripts.
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch every course with its modules and illustration counts (for the catalog view).
async function getCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('id, slug, title, subtitle, step, sort_order')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

// Fetch one course's modules, ordered.
async function getModules(courseSlug) {
  const { data, error } = await supabase
    .from('modules')
    .select('id, slug, title, summary, sort_order, course:courses!inner(slug)')
    .eq('course.slug', courseSlug)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

// Fetch every illustration (2D + 3D) for a module, with its storage paths resolved
// to public URLs.
async function getIllustrations(moduleSlug) {
  const { data, error } = await supabase
    .from('illustrations')
    .select(`
      id, title, description, kind, storage_path, model_path,
      sort_order,
      module:modules!inner(slug, title, course:courses(slug, title))
    `)
    .eq('module.slug', moduleSlug)
    .order('sort_order', { ascending: true });
  if (error) throw error;

  return data.map((row) => ({
    ...row,
    image_url: row.storage_path
      ? supabase.storage.from('illustrations').getPublicUrl(row.storage_path).data.publicUrl
      : null,
    model_url: row.model_path
      ? supabase.storage.from('models-3d').getPublicUrl(row.model_path).data.publicUrl
      : null,
  }));
}

module.exports = {
  supabase,
  getCourses,
  getModules,
  getIllustrations,
};
