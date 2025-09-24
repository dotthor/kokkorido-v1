/* import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://ppddtihaakyfivzrzzem.supabase.co', 'xxx')

// Create a function to handle inserts
const handleInserts = (payload) => {
    console.log('Change received!', payload)
}

// Listen to inserts
supabase
    .channel('countries')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'countries' }, handleInserts)
    .subscribe() */
