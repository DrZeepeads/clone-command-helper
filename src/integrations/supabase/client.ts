// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://tkosrnzfbesivkpvqtgy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrb3NybnpmYmVzaXZrcHZxdGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MDk4NzYsImV4cCI6MjA0ODk4NTg3Nn0.M9RBxP7OQcGJYpB0NO-VpJjzfqDkjdU-GC31VG0upqM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);