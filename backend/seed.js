
const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

const DEFAULT_CATEGORIES = [
    { id: 'progressivas', name: 'Progressivas', slug: 'progressivas', link: 'categorias/progressivas/index.html', active: true },
    { id: 'mascaras', name: 'Máscaras Capilares', slug: 'mascaras', link: 'categorias/mascaras/index.html', active: true },
    { id: 'escovas', name: 'Escovas & Pentes', slug: 'escovas', link: 'categorias/escovas/index.html', active: true },
    { id: 'tratamentos', name: 'Tratamentos', slug: 'tratamentos', link: 'categorias/tratamentos/index.html', active: true },
    { id: 'extensoes', name: 'Extensões', slug: 'extensoes', link: 'categorias/extensoes/index.html', active: true }
];

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
      order_index: 1,
      details: {
          infoTitle: 'Progressiva Vegetal Havana',
          info1: { title: 'Destaque', text: 'A única progressiva 100% vegetal aprovada pela Anvisa.' }
      }
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
    },
    {
      slug: 'organic-lizz',
      name: 'Organic Lizz (compre 1 leve 2)',
      price: '197,00',
      badge: 'Orgânico',
      badge_class: 'badge-hot',
      category: 'progressivas',
      stars: 5,
      image: 'produtos/organic-lizz/images/capa.webp',
      link: 'produtos/organic-lizz/index.html',
      description: 'Progressiva orgânica Lizz para cabelos naturais.',
      featured: false,
      visible: true,
      order_index: 4
    },
    {
      slug: 'progressiva-love-lizz',
      name: 'Love Lizz — Progressiva de Chuveiro (compre 1 leve 2)',
      price: '157,00',
      badge: 'Chuveiro',
      badge_class: 'badge-new',
      category: 'progressivas',
      stars: 5,
      image: 'produtos/progressiva-love-lizz/images/D_NQ_NP_2X_886189-MLB80285201091_102024-F.webp',
      link: 'produtos/progressiva-love-lizz/index.html',
      description: 'Progressiva de chuveiro Love Lizz, prática e eficiente.',
      featured: false,
      visible: true,
      order_index: 5
    },
    {
      slug: 'liso-therapy',
      name: 'Liso Therapy — Realinhamento Térmico',
      price: '197,00',
      badge: 'Orgânico',
      badge_class: 'badge-hot',
      category: 'progressivas',
      stars: 5,
      image: 'produtos/liso-therapy/images/capa.png',
      link: 'produtos/liso-therapy/index.html',
      description: 'Liso Therapy — realinhamento térmico orgânico.',
      featured: false,
      visible: true,
      order_index: 6
    },
    {
      slug: 'progressiva-liss-divine',
      name: 'Progressiva Liss Divine (compre 1 leve 2)',
      price: '247,00',
      badge: '',
      badge_class: '',
      category: 'progressivas',
      stars: 5,
      image: 'produtos/progressiva-liss-divine/images/1.jpg',
      link: 'produtos/progressiva-liss-divine/index.html',
      description: 'Progressiva Liss Divine para um liso duradouro e brilhoso.',
      featured: false,
      visible: true,
      order_index: 7
    },
    {
      slug: 'lumiliss',
      name: 'LumiLiss Prime — Reparador Termo-Hidroativado (compre 1 leve 2)',
      price: '197,00',
      badge: '',
      badge_class: '',
      category: 'progressivas',
      stars: 5,
      image: 'produtos/lumiliss/images/capa.png',
      link: 'produtos/lumiliss/index.html',
      description: 'LumiLiss Prime para reparação térmica e hidratação intensa.',
      featured: false,
      visible: true,
      order_index: 8
    },
    {
      slug: 'mascara-explosao',
      name: 'Explosão de Brilho — Máscara Ultra Hidratante (compre 1 leve 2)',
      price: '247,00',
      badge: 'Top vendas',
      badge_class: 'badge-best',
      category: 'mascaras',
      stars: 5,
      image: 'produtos/mascara-explosao/images/capa.png',
      link: 'produtos/mascara-explosao/index.html',
      description: 'Máscara ultra hidratante Explosão de Brilho para cabelos secos.',
      featured: false,
      visible: true,
      order_index: 9
    },
    {
      slug: 'mascara-vita',
      name: 'Máscara Capilar Vita A 500g (compre 1 leve 2)',
      price: '180,00',
      badge: 'Novo',
      badge_class: 'badge-new',
      category: 'mascaras',
      stars: 5,
      image: 'produtos/mascara-vita/images/capa.png',
      link: 'produtos/mascara-vita/index.html',
      description: 'Máscara Capilar Vita A 500g com vitamina A para cabelos danificados.',
      featured: false,
      visible: true,
      order_index: 10
    },
    {
      slug: 'mascara-desmaia-cabelo',
      name: 'Desmaia Cabelo — Máscara Restauradora (compre 1 leve 2)',
      price: '207,00',
      badge: '',
      badge_class: '',
      category: 'mascaras',
      stars: 5,
      image: 'produtos/mascara-desmaia-cabelo/images/capa.jpg',
      link: 'produtos/mascara-desmaia-cabelo/index.html',
      description: 'Máscara restauradora Desmaia Cabelo para cabelos fragilizados.',
      featured: false,
      visible: true,
      order_index: 11
    },
    {
      slug: 'melanine-hair',
      name: 'Melanine Hair — Tônico em Gotas',
      price: '59,90',
      badge: 'Tratamento',
      badge_class: 'badge-hot',
      category: 'tratamentos',
      stars: 5,
      image: 'produtos/melanine-hair/images/capa.png',
      link: 'produtos/melanine-hair/index.html',
      description: 'Tônico em gotas Melanine Hair para cabelos com falta de brilho.',
      featured: false,
      visible: true,
      order_index: 12
    },
    {
      slug: 'ativador-de-crescimento',
      name: 'PRO+ Ativador de Crescimento Spray (compre 1 leve 2)',
      price: '197,00',
      badge: '',
      badge_class: '',
      category: 'tratamentos',
      stars: 5,
      image: 'produtos/ativador-de-crescimento/images/capa.jpeg',
      link: 'produtos/ativador-de-crescimento/index.html',
      description: 'Spray ativador de crescimento capilar PRO+.',
      featured: false,
      visible: true,
      order_index: 13
    },
    {
      slug: 'creatina-cabelo-unha',
      name: 'Creatina — Cabelo & Unha (compre 1 leve 2)',
      price: '197,00',
      badge: 'Suplemento',
      badge_class: 'badge-new',
      category: 'tratamentos',
      stars: 5,
      image: 'produtos/creatina-cabelo-unha/images/capa.png',
      link: 'produtos/creatina-cabelo-unha/index.html',
      description: 'Creatina capilar para fortalecer cabelos e unhas.',
      featured: false,
      visible: true,
      order_index: 14
    },
    {
      slug: 'escova-alisadora',
      name: 'Escova Alisadora 5 em 1 — Alisa, Hidrata, Modela',
      price: '119,00',
      badge: 'Mais vendido',
      badge_class: 'badge-best',
      category: 'escovas',
      stars: 5,
      image: 'produtos/escova-alisadora/images/capa.jpg',
      link: 'produtos/escova-alisadora/index.html',
      description: 'Escova alisadora 5 em 1 que alisa, hidrata e modela os cabelos.',
      featured: false,
      visible: true,
      order_index: 15
    },
    {
      slug: 'shampoo-antirresíduo',
      name: 'Shampoo Antirresíduo',
      price: '79,90',
      badge: '',
      badge_class: '',
      category: 'tratamentos',
      stars: 5,
      image: 'produtos/shampoo-antirresíduo/images/capa.jpg',
      link: 'produtos/shampoo-antirresíduo/index.html',
      description: 'Shampoo antirresíduo para preparar o cabelo antes da progressiva.',
      featured: false,
      visible: true,
      order_index: 16
    }
];

const DEFAULT_HOME = {
    heroBanners: [
      { desktopSrc: 'images/hero-banner.jpg', mobileSrc: 'images/hero-banner-mobile.png', desktopBase64: null, mobileBase64: null },
      { desktopSrc: 'images/hero-banner1.jpg', mobileSrc: 'images/hero-banner1-mobile.png', desktopBase64: null, mobileBase64: null },
      { desktopSrc: 'images/hero-banner2.jpg', mobileSrc: 'images/hero-banner2-mobile.png', desktopBase64: null, mobileBase64: null }
    ],
    catBanners: [
      { title: 'Progressivas & Alisamentos', subtitle: 'Ver coleção completa', link: 'categorias/progressivas/index.html', src: 'images/banner-progressivas.png', base64: null },
      { title: 'Escovas & Ferramentas', subtitle: 'Ver coleção completa', link: 'categorias/escovas/index.html', src: 'images/banner-escovas.png', base64: null }
    ],
    announcementBar: 'Frete grátis para todo o Brasil &nbsp;·&nbsp; Pagamento somente na entrega &nbsp;·&nbsp; Sem cartão antecipado',
    sectionTitle: 'Todos os nossos',
    sectionTitleEm: 'produtos',
    sectionSubtitle: 'Frete grátis para todo o Brasil. Pagamento somente na entrega.'
};

async function seed() {
    try {
        console.log('Seeding categories...');
        for (const cat of DEFAULT_CATEGORIES) {
            await axios.post(`${API_URL}/categories/save`, cat);
        }
        
        console.log('Seeding products...');
        for (const prod of DEFAULT_PRODUCTS) {
            await axios.post(`${API_URL}/products/save`, prod);
        }
        
        console.log('Seeding home data...');
        await axios.post(`${API_URL}/settings/home_data`, DEFAULT_HOME);
        
        console.log('Seed completed successfully!');
    } catch (err) {
        console.error('Seed failed:', err.response ? err.response.data : err.message);
    }
}

seed();
