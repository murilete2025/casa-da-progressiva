
require('dotenv').config({ path: './.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function test() {
    try {
        const { data, error } = await supabase.from('products').select('count', { count: 'exact' });
        if (error) {
            console.error('Error message:', error.message);
        } else {
            console.log('Success! Total products in DB:', data[0]?.count || 0);
        }
    } catch (err) {
        console.error('Exception:', err);
    }
}

test();
