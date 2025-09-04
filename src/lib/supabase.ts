import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Quote = {
  id: string;
  external_reference_id?: string;
  vehicle_data: any;
  driver_data: any;
  quote_response?: any;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  quote_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  id_number?: string;
  contact_number: string;
  application_user?: string;
  application_user_email?: string;
  status: string;
  created_at: string;
};