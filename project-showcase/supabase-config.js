// ==================== SUPABASE CONFIG ====================

// Your Supabase project URL
const SUPABASE_URL = "https://xjxzrsgpissusmulmwfe.supabase.co";

// Your Supabase publishable key
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_QrUv8Mw7IyvGC-WU2UAdUw_RWXqE-vu";

// Create the Supabase client
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);