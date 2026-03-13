
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function check() {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    if (data && data.length > 0) {
        console.log('Columns in products table:', Object.keys(data[0]));
    } else {
        console.log('No data found in products table.');
    }
}
check();
