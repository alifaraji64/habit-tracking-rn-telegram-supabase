import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase project settings
export const SUPABASE_URL = 'https://azyixneoovrtlrniqzpk.supabase.co'; // replace with your URL
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6eWl4bmVvb3ZydGxybmlxenBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MTQ0MTUsImV4cCI6MjA3MDM5MDQxNX0.bkGllBRBrUepCjWjXbVg7inaKMNpZUTxyXvz-51Nkb4'; // replace with your anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
	auth: {
		storage: AsyncStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
