import { createClient } from "@supabase/supabase-js";

// The env var may include /rest/v1/ from the Supabase dashboard URL — strip it
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

export const supabasePublic = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side only — never import in Client Components
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
