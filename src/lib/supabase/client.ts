// // lib/supabase/client.ts
// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://ujswkxqlkeyegananzqn.supabase.co'
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqc3dreHFsa2V5ZWdhbmFuenFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MTkzNzYsImV4cCI6MjA2OTE5NTM3Nn0.8xIhBPiZMxdrPcyQHOp4Y1AWhaJu9LErfc6DK4eoE1o'

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ujswkxqlkeyegananzqn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqc3dreHFsa2V5ZWdhbmFuenFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MTkzNzYsImV4cCI6MjA2OTE5NTM3Nn0.8xIhBPiZMxdrPcyQHOp4Y1AWhaJu9LErfc6DK4eoE1o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
  ,
     // Important pour Vercel
    flowType: 'pkce' // Nécessaire pour les déploiements serverless
  }
})