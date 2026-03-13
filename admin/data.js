/* data.js - Sistema de Dados (LocalStorage) */
const CP_DATA_KEY = 'cp_data_v2';

// Estrutura inicial default (fallback para quando resetar)
const initialData = {
    settings: {
        adminPassword: 'admin',
        contactNumber: '5562981670981'
    },
    storeSettings: {
        whatsapp: '5562981670981',
        whatsappMessage: 'Olá%2C vim do site Casa da Progressiva e gostaria de saber mais sobre os produtos',
        facebookPixelId: '',
        googleTagManagerId: '',
        instagramUrl: '',
        facebookUrl: '',
        tiktokUrl: ''
    },
    testimonials: [
        { id: 1, name: 'Ana Paula S.', product: 'Progressiva Vegetal Havana', stars: 5, text: 'Uso há 3 meses e o resultado é incrível! Meu cabelo ficou liso, brilhoso e macio sem nenhum produto agressivo. Super recomendo!' },
        { id: 2, name: 'Carla R.', product: 'Progressiva Liso Mágico', stars: 5, text: 'Não acreditava que daria certo aplicando em casa, mas ficou melhor do que no salão. E o pagamento na entrega me deu mais segurança.' },
        { id: 3, name: 'Juliane C.', product: 'Escova Alisadora 3 em 1', stars: 5, text: 'A Escova Alisadora 3 em 1 é um sonho! Uso em casa igual ao salão, economiza muito tempo e o resultado dura dias. Super recomendo comprar na Casa da Progressiva.' }
    ],
    home: {
        heroSlides: [
            { desktop: '../images/hero-banner.jpg', mobile: '../images/hero-banner-mobile.png', active: true },
            { desktop: '../images/hero-banner1.jpg', mobile: '../images/hero-banner1-mobile.png', active: true },
            { desktop: '../images/hero-banner2.jpg', mobile: '../images/hero-banner2-mobile.png', active: true }
        ],
        featuredProduct: 'progressiva-havana'
    },
    categories: [
        { id: 'progressivas', name: 'Progressivas', badge: 'banner-progressivas.png' },
        { id: 'escovas', name: 'Escovas', badge: 'banner-escovas.png' },
        { id: 'mascaras', name: 'Máscaras Capilares', badge: '' },
        { id: 'tratamentos', name: 'Tratamentos', badge: '' },
        { id: 'extensoes', name: 'Extensões', badge: '' }
    ],
    products: [
        // Progressivas
        { id: 'progressiva-havana', categoryId: 'progressivas', name: 'Progressiva Vegetal Havana (compre 1 leve 2)', price: '197,00', originalPrice: '297,00', 
          description: 'A única progressiva 100% vegetal aprovada pela Anvisa, sem formol e com resultado já na primeira aplicação. Liso profissional em casa.', 
          badge: 'Mais vendido', badgeClass: 'badge-best', image: '../produtos/progressiva-havana/images/capa.jpg', image2: '../produtos/progressiva-havana/images/2.jpg', 
          image3: '', image4: '', image5: '',
          checkoutUrl: '#', isFeatured: true, features: ['Sem formol', 'Passo único', 'Cheiro suave'],
          faq: [], countdownHours: 0 },
          
        { id: 'progressiva-liso-magico', categoryId: 'progressivas', name: 'Progressiva Liso Mágico (compre 1 leve 2)', price: '197,00', originalPrice: '297,00', 
          description: 'Desperte o brilho e o liso perfeito com a Progressiva Liso Mágico.', 
          badge: '', badgeClass: '', image: '../produtos/progressiva-liso-magico/images/capa.png', image2: '', 
          checkoutUrl: '#', isFeatured: false, features: [] },

        { id: 'progressiva-liss-gold', categoryId: 'progressivas', name: 'Progressiva Liss Gold (compre 1 leve 2)', price: '297,00', originalPrice: '397,00', 
          description: 'Liso extremo e hidratação profunda em um único passo.', 
          badge: '', badgeClass: '', image: '../produtos/progressiva-liss-gold/images/capa.jpeg', image2: '', 
          checkoutUrl: '#', isFeatured: false, features: [] },

        { id: 'organic-lizz', categoryId: 'progressivas', name: 'Organic Lizz (compre 1 leve 2)', price: '197,00', originalPrice: '297,00', 
          description: 'Fórmula 100% orgânica para um liso natural, solto e cheio de vida.', 
          badge: 'Orgânico', badgeClass: 'badge-hot', image: '../produtos/organic-lizz/images/capa.webp', image2: '', 
          checkoutUrl: '#', isFeatured: false, features: [] },
          
        { id: 'progressiva-love-lizz', categoryId: 'progressivas', name: 'Love Lizz — Progressiva de Chuveiro (compre 1 leve 2)', price: '157,00', originalPrice: '257,00', 
          description: 'A praticidade de um liso de salão na hora do banho.', 
          badge: 'Chuveiro', badgeClass: 'badge-new', image: '../produtos/progressiva-love-lizz/images/D_NQ_NP_2X_886189-MLB80285201091_102024-F.webp', image2: '', 
          checkoutUrl: '#', isFeatured: false, features: [] },

        { id: 'liso-therapy', categoryId: 'progressivas', name: 'Liso Therapy — Realinhamento Térmico', price: '197,00', originalPrice: '297,00', 
          description: 'Realinhamento capilar térmico que restaura os fios enquanto alisa.', 
          badge: 'Orgânico', badgeClass: 'badge-hot', image: '../produtos/liso-therapy/images/capa.png', image2: '', 
          checkoutUrl: '#', isFeatured: false, features: [] },

        { id: 'progressiva-liss-divine', categoryId: 'progressivas', name: 'Progressiva Liss Divine (compre 1 leve 2)', price: '247,00', originalPrice: '347,00', 
          description: 'Um liso divino e duradouro, com nutrição intensiva.', 
          badge: '', badgeClass: '', image: '../produtos/progressiva-liss-divine/images/1.jpg', image2: '', 
          checkoutUrl: '#', isFeatured: false, features: [] },
          
        { id: 'lumiliss', categoryId: 'progressivas', name: 'LumiLiss Prime — Reparador Termo-Hidroativado', price: '197,00', originalPrice: '297,00', 
          description: 'Inovação em reparação que alinha os fios e progeto contra o calor.', 
          badge: '', badgeClass: '', image: '../produtos/lumiliss/images/capa.png', image2: '', 
          checkoutUrl: '#', isFeatured: false, features: [] },

        // Máscaras
        { id: 'mascara-explosao', categoryId: 'mascaras', name: 'Explosão de Brilho — Máscara Ultra Hidratante (compre 1 leve 2)', price: '247,00', originalPrice: '347,00', 
          description: 'Hidratação profunda para cabelos ressecados, devolvendo o brilho e a maciez na hora.', 
          badge: 'Top vendas', badgeClass: 'badge-best', image: '../produtos/mascara-explosao/images/capa.png', image2: '', 
          checkoutUrl: '#', isFeatured: false, features: [] },
          
        { id: 'mascara-vita', categoryId: 'mascaras', name: 'Máscara Capilar Vita A 500g (compre 1 leve 2)', price: '180,00', originalPrice: '280,00', 
          description: 'Vitamina A pura para nutrir e fortalecer a fibra capilar de dentro para fora.', 
          badge: 'Novo', badgeClass: 'badge-new', image: '../produtos/mascara-vita/images/capa.png', image2: '', 
          checkoutUrl: '#', isFeatured: false, features: [] },
          
        { id: 'mascara-desmaia-cabelo', categoryId: 'mascaras', name: 'Desmaia Cabelo — Máscara Restauradora (compre 1 leve 2)', price: '207,00', originalPrice: '307,00', 
          description: 'Ação anti-frizz e anti-volume imediata, deixando os fios extremamente macios, sedosos e maleáveis.', 
          badge: '', badgeClass: '', image: '../produtos/mascara-desmaia-cabelo/images/capa.jpg', image2: '', 
          checkoutUrl: '#', isFeatured: false, features: [] },

        // Tratamentos
        { id: 'melanine-hair', categoryId: 'tratamentos', name: 'Melanine Hair — Tônico em Gotas', price: '59,90', originalPrice: '99,90', 
          description: 'Um poderoso tônico para estimular a saúde do bulbo capilar e fortalecer os fios escuros.', 
          badge: 'Tratamento', badgeClass: 'badge-hot', image: '../produtos/melanine-hair/images/capa.png', image2: '', 
          checkoutUrl: '#', isFeatured: false, features: [] },
          
        { id: 'ativador-de-crescimento', categoryId: 'tratamentos', name: 'PRO+ Ativador de Crescimento Spray (compre 1 leve 2)', price: '197,00', originalPrice: '297,00', 
          description: 'Acelera o crescimento natural dos cabelos combatendo a queda com eficácia comprovada.', 
          badge: '', badgeClass: '', image: '../produtos/ativador-de-crescimento/images/capa.jpeg', image2: '', 
          checkoutUrl: '#', isFeatured: false, features: [] },
          
        { id: 'creatina-cabelo-unha', categoryId: 'tratamentos', name: 'Creatina — Cabelo & Unha (compre 1 leve 2)', price: '197,00', originalPrice: '297,00', 
          description: 'Suplementação intensiva de dentro para fora, para cabelos mais longos e fortes e unhas inquebráveis.', 
          badge: 'Suplemento', badgeClass: 'badge-new', image: '../produtos/creatina-cabelo-unha/images/capa.png', image2: '', 
          checkoutUrl: '#', isFeatured: false, features: [] },
          
        // Escovas
        { id: 'escova-alisadora', categoryId: 'escovas', name: 'Escova Alisadora 5 em 1 — Alisa, Hidrata, Modela', price: '119,00', originalPrice: '219,00', 
          description: 'Tecnologia íonônica de ponta para alisar os cabelos rapidamente, secando e modelando no mesmo passo.', 
          badge: 'Mais vendido', badgeClass: 'badge-best', image: '../produtos/escova-alisadora/images/capa.jpg', image2: '', 
          checkoutUrl: '#', isFeatured: false, features: [] }
    ]
};

// Funções do Banco de Dados Local
const DB = {
    init: function() {
        if (!localStorage.getItem(CP_DATA_KEY)) {
            localStorage.setItem(CP_DATA_KEY, JSON.stringify(initialData));
            console.log('Database initialized with default data.');
        }
    },
    
    get: function() {
        this.init();
        return JSON.parse(localStorage.getItem(CP_DATA_KEY));
    },
    
    save: function(data) {
        localStorage.setItem(CP_DATA_KEY, JSON.stringify(data));
        return true;
    },

    getProduct: function(id) {
        const data = this.get();
        return data.products.find(p => p.id === id);
    },

    saveProduct: function(productObj) {
        const data = this.get();
        const index = data.products.findIndex(p => p.id === productObj.id);
        if (index > -1) {
            data.products[index] = { ...data.products[index], ...productObj };
        } else {
            data.products.push(productObj);
        }
        this.save(data);
    },

    deleteProduct: function(id) {
        const data = this.get();
        data.products = data.products.filter(p => p.id !== id);
        this.save(data);
    },
    
    // Converte imagens em base64 com resize se passarem de um certo tamanho (evitar crash do localStorage)
    readImageAsBase64: function(file, maxWidth = 800) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.85); // 85% de qualidade 
                    resolve(dataUrl);
                };
                img.onerror = () => reject('Erro ao carregar a imagem para conversão.');
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }
};

// Inicializa no fim
if (typeof window !== 'undefined') {
    DB.init();
}
