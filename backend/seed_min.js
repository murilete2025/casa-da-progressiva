
require('dotenv').config({ path: './.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function seed() {
    console.log('Inserting Havana...');
    const prod = {
        name: 'Progressiva Vegetal Havana (compre 1 leve 2)',
        description: 'A única progressiva 100% vegetal aprovada pela Anvisa, sem formol e com resultado já na primeira aplicação.',
        price: '197.00',
        image1: 'produtos/progressiva-havana/images/capa.jpg'
    };
    const { data, error } = await supabase.from('products').insert(prod).select();
    if (error) {
        console.error('Failed:', error.message);
    } else {
        console.log('Seeded Havana!', data[0].id);
    }
}
seed();
