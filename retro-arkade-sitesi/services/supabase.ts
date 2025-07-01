import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nxeetmdswcwybnkhflpw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54ZWV0bWRzd2N3eWJua2hmbHB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzODAxMzgsImV4cCI6MjA2Njk1NjEzOH0.9rnGVw7gJbLoxpNnYQ1yUHUM4AR1N2h37Use9juVHGM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);