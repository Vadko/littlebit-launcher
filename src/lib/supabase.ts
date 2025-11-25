import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// TODO: Замініть ці значення на реальні URL та ключ з вашого Supabase проекту
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Electron не потребує сесій
    autoRefreshToken: false,
  },
});
