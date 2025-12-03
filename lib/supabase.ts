import { createClient } from "@supabase/supabase-js";

const url = (import.meta.env?.VITE_SUPABASE_URL as string | undefined) ?? process.env.VITE_SUPABASE_URL;
const key = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined) ?? process.env.VITE_SUPABASE_ANON_KEY;

let client: any;

if (!url || !key) {
  client = {
    auth: {
      signUp: async () => ({ data: null, error: new Error("Supabase not configured") }),
      getUser: async () => ({ data: { user: null } }),
      signInWithPassword: async () => ({ data: null, error: new Error("Supabase not configured") }),
    },
  };
} else {
  client = createClient(url, key);
}

export default client;