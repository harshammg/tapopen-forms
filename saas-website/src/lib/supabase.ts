import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zyyqsqyxuwwcnaoqfkyj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5eXFzcXl4dXd3Y25hb3Fma3lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MDQxOTgsImV4cCI6MjA5NzE4MDE5OH0.gcq0VuHwMyjBjOnxXJvxW-GYJzofIt25SZNhihsCB_Q';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
