import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://fywfjhlugfyorteizurk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5d2ZqaGx1Z2Z5b3J0ZWl6dXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODIyNTcsImV4cCI6MjA4ODk1ODI1N30.syNqrAksc0nsxJSGjCUonsFzMbjqfUuiuGyY8iZq8sk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
