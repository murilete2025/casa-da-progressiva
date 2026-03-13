
require('dotenv').config({ path: './.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const DEFAULT_PRODUCTS = [
    {
      slug: 'progressiva-havana',
      name: 'Progressiva Vegetal Havana (compre 1 leve 2)',
      price: '197,00',
      badge: 'Mais vendido',
      badge_class: 'badge-best',
      category: 'progressivas',
      stars: 5,
      image: 'produtos/progressiva-havana/images/capa.jpg',
      link: 'produtos/progressiva-havana/index.html',
      description: 'A única progressiva 100% vegetal aprovada pela Anvisa, sem formol e com resultado já na primeira aplicação. Liso profissional em casa.',
      featured: true,
      visible: true,
      order_index: 1
    },
    {
      slug: 'progressiva-liso-magico',
      name: 'Progressiva Liso Mágico (compre 1 leve 2)',
      price: '197,00',
      badge: '',
      badge_class: '',
      category: 'progressivas',
      stars: 5,
      image: 'produtos/progressiva-liso-magico/images/capa.png',
      link: 'produtos/progressiva-liso-magico/index.html',
      description: 'Progressiva Liso Mágico para cabelos lisos e sem frizz.',
      featured: false,
      visible: true,
      order_index: 2
    },
    {
      slug: 'progressiva-liss-gold',
      name: 'Progressiva Liss Gold (compre 1 leve 2)',
      price: '297,00',
      badge: '',
      badge_class: '',
      category: 'progressivas',
      stars: 5,
      image: 'produtos/progressiva-liss-gold/images/capa.jpeg',
      link: 'produtos/progressiva-liss-gold/index.html',
      description: 'Progressiva Liss Gold para cabelos com brilho intenso.',
      featured: false,
      visible: true,
      order_index: 3
    }
    // ... adding more if it works
];

async function seed() {
    console.log('Inserting products via REST API...');
    for (const prod of DEFAULT_PRODUCTS) {
        const { error } = await supabase.from('products').upsert(prod, { onConflict: 'slug' });
        if (error) {
            console.error(`Failed ${prod.slug}:`, error.message);
        } else {
            console.log(`Seeded ${prod.slug}`);
        }
    }
}

seed();
