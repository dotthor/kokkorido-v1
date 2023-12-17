/* import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://ppddtihaakyfivzrzzem.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZGR0aWhhYWt5Zml2enJ6emVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4OTMzNTgsImV4cCI6MjAxNTQ2OTM1OH0.RFG0bJ7xPLxd4vP6vQf7wNvDNovFE3_0fB_LmUQrtAI')

// Create a function to handle inserts
const handleInserts = (payload) => {
    console.log('Change received!', payload)
}

// Listen to inserts
supabase
    .channel('countries')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'countries' }, handleInserts)
    .subscribe() */