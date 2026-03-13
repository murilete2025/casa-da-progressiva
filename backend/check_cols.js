
require('dotenv').config({ path: './.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function check() {
    const { data, error } = await supabase.from('products').insert({ name: 'test' }).select();
    if (error) console.log('Error:', error.message);
    else console.log('Columns:', Object.keys(data[0]));
}
check();
