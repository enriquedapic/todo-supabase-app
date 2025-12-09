import { createClient } from '@supabase/supabase-js';

// Las variables se cargan desde el archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno de Supabase. Revisa el archivo .env.local');
}

// Cliente que usaremos para todas las operaciones en la base de datos
export const supabase = createClient(supabaseUrl, supabaseAnonKey);