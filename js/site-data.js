/**
 * site-data.js — Casa da Progressiva
 * Carrega dados do painel admin (localStorage) e injeta no site público.
 * Se não houver dados no localStorage, o site funciona normalmente com HTML estático.
 */

(function () {
  'use strict';

  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:4000/api' 
    : '/api';

  // ──────────────────────────────────────────────
  // DATA LOADING
  // ──────────────────────────────────────────────
  async function loadSiteData() {
    if (window._siteDataLoaded) return;
    try {
        console.log('Loading live data from API...');
        
        // Home Data
        const rHome = await fetch(`${API_URL}/settings/home_data`);
        const hData = await rHome.json();
        if (hData && Object.keys(hData).length > 0) {
            window._siteHome = hData;
        }

        // Products
        const rProds = await fetch(`${API_URL}/products`);
        const pData = await rProds.json();
        if (pData && pData.length > 0) {
            window._siteProducts = pData;
            console.log('Sample product:', pData[0]); // Debug
        }

        // Categories
        const rCats = await fetch(`${API_URL}/categories`);
        const cData = await rCats.json();
        if (cData && cData.length > 0) {
            window._siteCategories = cData;
        }
        
        window._siteDataLoaded = true;
        console.log('Site data loaded from API');
    } catch (err) {
        console.error('Failed to load data from API, using defaults:', err);
    }
  }
  const DEFAULT_PRODUCTS = [
    {
      id: 'progressiva-havana',
      slug: 'progressiva-havana',
      name: 'Progressiva Vegetal Havana (compre 1 leve 2)',
      price: '197,00',
      badge: 'Mais vendido',
      badgeClass: 'badge-best',
      category: 'progressivas',
      stars: 5,
      image: 'produtos/progressiva-havana/images/capa.jpg',
      link: 'produtos/progressiva-havana/index.html',
      description: 'A única progressiva 100% vegetal aprovada pela Anvisa, sem formol e com resultado já na primeira aplicação. Liso profissional em casa.',
      featured: true,
      featuredImage: 'produtos/progressiva-havana/images/2.jpg',
      featuredTitle: 'Progressiva Vegetal Havana',
      featuredSubtitle: 'Produto destaque',
      featuredText: 'A única progressiva 100% vegetal aprovada pela Anvisa, sem formol e com resultado já na primeira aplicação. Liso profissional em casa.',
      featuredBtnText: 'Conhecer o produto',
      visible: true,
      order: 1
    },
    {
      id: 'progressiva-liso-magico',
      slug: 'progressiva-liso-magico',
      name: 'Progressiva Liso Mágico (compre 1 leve 2)',
      price: '197,00',
      badge: '',
      badgeClass: '',
      category: 'progressivas',
      stars: 5,
      image: 'produtos/progressiva-liso-magico/images/capa.png',
      link: 'produtos/progressiva-liso-magico/index.html',
      description: 'Progressiva Liso Mágico para cabelos lisos e sem frizz.',
      featured: false,
      visible: true,
      order: 2
    },
    {
      id: 'progressiva-liss-gold',
      slug: 'progressiva-liss-gold',
      name: 'Progressiva Liss Gold (compre 1 leve 2)',
      price: '297,00',
      badge: '',
      badgeClass: '',
      category: 'progressivas',
      stars: 5,
      image: 'produtos/progressiva-liss-gold/images/capa.jpeg',
      link: 'produtos/progressiva-liss-gold/index.html',
      description: 'Progressiva Liss Gold para cabelos com brilho intenso.',
      featured: false,
      visible: true,
      order: 3
    },
    {
      id: 'organic-lizz',
      slug: 'organic-lizz',
      name: 'Organic Lizz (compre 1 leve 2)',
      price: '197,00',
      badge: 'Orgânico',
      badgeClass: 'badge-hot',
      category: 'progressivas',
      stars: 5,
      image: 'produtos/organic-lizz/images/capa.webp',
      link: 'produtos/organic-lizz/index.html',
      description: 'Progressiva orgânica Lizz para cabelos naturais.',
      featured: false,
      visible: true,
      order: 4
    },
    {
      id: 'progressiva-love-lizz',
      slug: 'progressiva-love-lizz',
      name: 'Love Lizz — Progressiva de Chuveiro (compre 1 leve 2)',
      price: '157,00',
      badge: 'Chuveiro',
      badgeClass: 'badge-new',
      category: 'progressivas',
      stars: 5,
      image: 'produtos/progressiva-love-lizz/images/D_NQ_NP_2X_886189-MLB80285201091_102024-F.webp',
      link: 'produtos/progressiva-love-lizz/index.html',
      description: 'Progressiva de chuveiro Love Lizz, prática e eficiente.',
      featured: false,
      visible: true,
      order: 5
    },
    {
      id: 'liso-therapy',
      slug: 'liso-therapy',
      name: 'Liso Therapy — Realinhamento Térmico',
      price: '197,00',
      badge: 'Orgânico',
      badgeClass: 'badge-hot',
      category: 'progressivas',
      stars: 5,
      image: 'produtos/liso-therapy/images/capa.png',
      link: 'produtos/liso-therapy/index.html',
      description: 'Liso Therapy — realinhamento térmico orgânico.',
      featured: false,
      visible: true,
      order: 6
    },
    {
      id: 'progressiva-liss-divine',
      slug: 'progressiva-liss-divine',
      name: 'Progressiva Liss Divine (compre 1 leve 2)',
      price: '247,00',
      badge: '',
      badgeClass: '',
      category: 'progressivas',
      stars: 5,
      image: 'produtos/progressiva-liss-divine/images/1.jpg',
      link: 'produtos/progressiva-liss-divine/index.html',
      description: 'Progressiva Liss Divine para um liso duradouro e brilhoso.',
      featured: false,
      visible: true,
      order: 7
    },
    {
      id: 'lumiliss',
      slug: 'lumiliss',
      name: 'LumiLiss Prime — Reparador Termo-Hidroativado (compre 1 leve 2)',
      price: '197,00',
      badge: '',
      badgeClass: '',
      category: 'progressivas',
      stars: 5,
      image: 'produtos/lumiliss/images/capa.png',
      link: 'produtos/lumiliss/index.html',
      description: 'LumiLiss Prime para reparação térmica e hidratação intensa.',
      featured: false,
      visible: true,
      order: 8
    },
    {
      id: 'mascara-explosao',
      slug: 'mascara-explosao',
      name: 'Explosão de Brilho — Máscara Ultra Hidratante (compre 1 leve 2)',
      price: '247,00',
      badge: 'Top vendas',
      badgeClass: 'badge-best',
      category: 'mascaras',
      stars: 5,
      image: 'produtos/mascara-explosao/images/capa.png',
      link: 'produtos/mascara-explosao/index.html',
      description: 'Máscara ultra hidratante Explosão de Brilho para cabelos secos.',
      featured: false,
      visible: true,
      order: 9
    },
    {
      id: 'mascara-vita',
      slug: 'mascara-vita',
      name: 'Máscara Capilar Vita A 500g (compre 1 leve 2)',
      price: '180,00',
      badge: 'Novo',
      badgeClass: 'badge-new',
      category: 'mascaras',
      stars: 5,
      image: 'produtos/mascara-vita/images/capa.png',
      link: 'produtos/mascara-vita/index.html',
      description: 'Máscara Capilar Vita A 500g com vitamina A para cabelos danificados.',
      featured: false,
      visible: true,
      order: 10
    },
    {
      id: 'mascara-desmaia-cabelo',
      slug: 'mascara-desmaia-cabelo',
      name: 'Desmaia Cabelo — Máscara Restauradora (compre 1 leve 2)',
      price: '207,00',
      badge: '',
      badgeClass: '',
      category: 'mascaras',
      stars: 5,
      image: 'produtos/mascara-desmaia-cabelo/images/capa.jpg',
      link: 'produtos/mascara-desmaia-cabelo/index.html',
      description: 'Máscara restauradora Desmaia Cabelo para cabelos fragilizados.',
      featured: false,
      visible: true,
      order: 11
    },
    {
      id: 'melanine-hair',
      slug: 'melanine-hair',
      name: 'Melanine Hair — Tônico em Gotas',
      price: '59,90',
      badge: 'Tratamento',
      badgeClass: 'badge-hot',
      category: 'tratamentos',
      stars: 5,
      image: 'produtos/melanine-hair/images/capa.png',
      link: 'produtos/melanine-hair/index.html',
      description: 'Tônico em gotas Melanine Hair para cabelos com falta de brilho.',
      featured: false,
      visible: true,
      order: 12
    },
    {
      id: 'ativador-de-crescimento',
      slug: 'ativador-de-crescimento',
      name: 'PRO+ Ativador de Crescimento Spray (compre 1 leve 2)',
      price: '197,00',
      badge: '',
      badgeClass: '',
      category: 'tratamentos',
      stars: 5,
      image: 'produtos/ativador-de-crescimento/images/capa.jpeg',
      link: 'produtos/ativador-de-crescimento/index.html',
      description: 'Spray ativador de crescimento capilar PRO+.',
      featured: false,
      visible: true,
      order: 13
    },
    {
      id: 'creatina-cabelo-unha',
      slug: 'creatina-cabelo-unha',
      name: 'Creatina — Cabelo & Unha (compre 1 leve 2)',
      price: '197,00',
      badge: 'Suplemento',
      badgeClass: 'badge-new',
      category: 'tratamentos',
      stars: 5,
      image: 'produtos/creatina-cabelo-unha/images/capa.png',
      link: 'produtos/creatina-cabelo-unha/index.html',
      description: 'Creatina capilar para fortalecer cabelos e unhas.',
      featured: false,
      visible: true,
      order: 14
    },
    {
      id: 'escova-alisadora',
      slug: 'escova-alisadora',
      name: 'Escova Alisadora 5 em 1 — Alisa, Hidrata, Modela',
      price: '119,00',
      badge: 'Mais vendido',
      badgeClass: 'badge-best',
      category: 'escovas',
      stars: 5,
      image: 'produtos/escova-alisadora/images/capa.jpg',
      link: 'produtos/escova-alisadora/index.html',
      description: 'Escova alisadora 5 em 1 que alisa, hidrata e modela os cabelos.',
      featured: false,
      visible: true,
      order: 15
    },
    {
      id: 'shampoo-antirresiduo',
      slug: 'shampoo-antirresíduo',
      name: 'Shampoo Antirresíduo',
      price: '79,90',
      badge: '',
      badgeClass: '',
      category: 'tratamentos',
      stars: 5,
      image: 'produtos/shampoo-antirresíduo/images/capa.jpg',
      link: 'produtos/shampoo-antirresíduo/index.html',
      description: 'Shampoo antirresíduo para preparar o cabelo antes da progressiva.',
      featured: false,
      visible: true,
      order: 16
    }
  ];

  const DEFAULT_CATEGORIES = [
    { id: 'progressivas', name: 'Progressivas', slug: 'progressivas', link: 'categorias/progressivas/index.html', active: true },
    { id: 'mascaras', name: 'Máscaras Capilares', slug: 'mascaras', link: 'categorias/mascaras/index.html', active: true },
    { id: 'escovas', name: 'Escovas & Pentes', slug: 'escovas', link: 'categorias/escovas/index.html', active: true },
    { id: 'tratamentos', name: 'Tratamentos', slug: 'tratamentos', link: 'categorias/tratamentos/index.html', active: true },
    { id: 'extensoes', name: 'Extensões', slug: 'extensoes', link: 'categorias/extensoes/index.html', active: true }
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

  // ───────────────────────────────────────────
  // HELPERS
  // ───────────────────────────────────────────
  function getData(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function starsHtml(n) {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  function truckIcon() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`;
  }

  function imgSrc(product) {
    let src = product.image_base_64 || product.image1 || 'images/placeholder.svg';
    if (src && !src.startsWith('data:') && !src.startsWith('http') && !src.startsWith('/') && src !== 'images/placeholder.svg') {
        src = '/' + src;
    }
    if (src === 'images/placeholder.svg') console.warn('Missing image for product:', product.slug);
    return src;
  }

  function featuredImgSrc(product) {
    return product.featuredImageBase64 || product.featured_image || product.image1 || imgSrc(product);
  }

// ───────────────────────────────────────────
// INJEÇÃO NA HOME (index.html)
// ───────────────────────────────────────────
async function patchHome() {
  await loadSiteData();
  const products   = window._siteProducts   || getData('cdp_products', null);
  const home       = window._siteHome       || getData('cdp_home', null);
  const categories = window._siteCategories || getData('cdp_categories', null);

    // Só aplica se houver dados salvos
    if (products && products.length > 0) {
      patchProductGrid(products);
    }
    if (home) {
      patchHeroBanners(home);
      patchCatBanners(home, categories || DEFAULT_CATEGORIES);
      patchAnnouncementBar(home);
    }
    if (products && products.length > 0) {
      patchFeaturedSection(products);
    }
    if (categories && categories.length > 0) {
      patchCatNav(categories);
    }
  }

  function patchProductGrid(products) {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;

    const visible = products.filter(p => p.visible !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
    if (visible.length === 0) return;

    grid.innerHTML = visible.map(p => {
      const src = imgSrc(p);
      const badge = (p.badge && p.badge !== 'none' && p.badge !== '') ? `<span class="badge ${p.badgeClass || 'badge-new'}">${p.badge}</span>` : '';
      const stars = starsHtml(p.stars || 5);
      const link = isAbsoluteOrSamePage(p.link) ? p.link : p.link;
      return `
        <div class="product-card">
          <div class="product-card-img">
            <img src="${src}" alt="${p.name}" onerror="this.src='images/placeholder.svg'">
            ${badge}
          </div>
          <div class="product-card-body">
            <div class="product-card-name">${p.name}</div>
            <div class="product-stars">${stars}</div>
            <div class="product-card-entrega">${truckIcon()} Paga somente na entrega</div>
            <div class="product-card-price"><sup>R$</sup>${p.price}</div>
            <a href="${link}" class="btn-card">Ver produto</a>
          </div>
        </div>`;
    }).join('');
  }

  function patchHeroBanners(home) {
    if (!home.heroBanners) return;
    const slides = document.querySelectorAll('.hero-slider .hero-slide');
    home.heroBanners.forEach((banner, i) => {
      if (!slides[i]) return;
      const desktop = slides[i].querySelector('.hero-banner-bg-desktop');
      const mobile = slides[i].querySelector('.hero-banner-bg-mobile');
      if (desktop) {
          desktop.src = banner.desktopBase64 || (banner.desktopSrc && !banner.desktopSrc.startsWith('/') ? '/' + banner.desktopSrc : banner.desktopSrc) || desktop.src;
      }
      if (mobile) {
          mobile.src = banner.mobileBase64 || (banner.mobileSrc && !banner.mobileSrc.startsWith('/') ? '/' + banner.mobileSrc : banner.mobileSrc) || mobile.src;
      }
    });
  }

  function patchCatBanners(home, categories) {
    if (!home.catBanners) return;
    const slides = document.querySelectorAll('.cat-banners .cat-slide');
    home.catBanners.forEach((banner, i) => {
      if (!slides[i]) return;
      const img = slides[i].querySelector('.cat-banner-bg');
      const h3 = slides[i].querySelector('.cat-banner-overlay h3');
      const p = slides[i].querySelector('.cat-banner-overlay p');
      const a = slides[i].querySelector('.cat-banner');
      if (img) {
          img.src = banner.base64 || (banner.src && !banner.src.startsWith('/') ? '/' + banner.src : banner.src) || img.src;
      }
      if (h3 && banner.title) h3.textContent = banner.title;
      if (p && banner.subtitle) p.textContent = banner.subtitle;
      if (a && banner.link) a.href = banner.link;
    });
  }

  function patchAnnouncementBar(home) {
    if (!home.announcementBar) return;
    const bar = document.querySelector('.bar');
    if (bar) bar.innerHTML = home.announcementBar;
  }

  function patchFeaturedSection(products) {
    const featured = products.find(p => p.featured && p.visible !== false);
    if (!featured) return;

    const promoVisualImg = document.querySelector('.promo-visual img');
    const promoHeading = document.querySelector('.promo-text .heading');
    const promoLabel = document.querySelector('.promo-text .label');
    const promoSub = document.querySelector('.promo-text .sub');
    const promoBtn = document.querySelector('.promo-text .btn-dark');

    if (promoVisualImg) {
      promoVisualImg.src = featuredImgSrc(featured);
      promoVisualImg.alt = featured.name;
    }
    if (promoHeading) {
      const parts = (featured.featuredTitle || featured.name).split(' ');
      const last = parts.pop();
      promoHeading.innerHTML = parts.join(' ') + '<br><em>' + last + '</em>';
    }
    if (promoLabel) promoLabel.textContent = featured.featuredSubtitle || 'Produto destaque';
    if (promoSub) promoSub.textContent = featured.featuredText || featured.description || '';
    if (promoBtn) {
      promoBtn.href = featured.link;
      promoBtn.textContent = featured.featuredBtnText || 'Conhecer o produto';
    }
  }

  function patchCatNav(categories) {
    const nav = document.querySelector('.cat-nav ul');
    if (!nav) return;
    const active = categories.filter(c => c.active !== false);
    const firstLi = nav.querySelector('li:first-child');
    const allHref = firstLi ? firstLi.querySelector('a').href : 'index.html#produtos';

    nav.innerHTML = `<li><a href="index.html#produtos" class="active">Todos</a></li>` +
      active.map(c =>
        `<li><a href="${c.link}">${c.name}</a></li>`
      ).join('');
  }

  function isAbsoluteOrSamePage(link) {
    return true; // always relative, just return as-is
  }

// ──────────────────────────────────────────────
// PATCH CATEGORY PAGE
// ──────────────────────────────────────────────
async function patchCategoryPage() {
    await loadSiteData();
    const categories = window._siteCategories || getData('cdp_categories', null);
    const products   = window._siteProducts   || getData('cdp_products', null);
    
    if (!products || !categories) return;

    // Descobre o slug da categoria pela URL
    const path = window.location.pathname.replace(/\\/g, '/');
    const match = path.match(/categorias\/([^/]+)/);
    if (!match) return;

    const catSlug = match[1];
    
    // Filtra produtos desta categoria
    const catProducts = products.filter(p => p.category === catSlug && p.visible !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
    
    const grid = document.querySelector('.product-grid');
    if (grid) {
      grid.innerHTML = catProducts.map(p => {
        // Resolve path to product relative to category folder
        const src = imgSrc(p);
        const resolvedImg = src.startsWith('data:') ? src : '../../' + src;
        const pLink = p.link || 'index.html';
        const link = pLink.startsWith('http') || pLink.startsWith('produto.html') 
            ? '../../' + pLink 
            : pLink.startsWith('produtos/') ? '../../' + pLink : pLink;

        const badge = (p.badge && p.badge !== 'none' && p.badge !== '') ? `<span class="badge ${p.badgeClass || 'badge-new'}">${p.badge}</span>` : '';
        const stars = starsHtml(p.stars || 5);
        return `
          <div class="product-card">
            <div class="product-card-img">
              <img src="${resolvedImg}" alt="${p.name}" onerror="this.src='../../images/placeholder.svg'">
              ${badge}
            </div>
            <div class="product-card-body">
              <div class="product-card-name">${p.name}</div>
              <div class="product-stars">${stars}</div>
              <div class="product-card-entrega">${truckIcon()} Paga somente na entrega</div>
              <div class="product-card-price"><sup>R$</sup>${p.price}</div>
              <a href="${link}" class="btn-card">Ver produto</a>
            </div>
          </div>`;
      }).join('');
    }

    // Atualiza a contagem de produtos
    const counts = document.querySelectorAll('.product-count, .cat-hero-count');
    counts.forEach(el => {
        if (el.innerHTML.includes('<svg')) {
             el.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg> ${catProducts.length} produtos nesta categoria`;
        } else {
             el.textContent = `${catProducts.length} produtos`;
        }
    });
  }

// ──────────────────────────────────────────────
// PATCH PRODUCT PAGE
// ──────────────────────────────────────────────
async function patchProductPage() {
    await loadSiteData();
    const products = window._siteProducts || getData('cdp_products', null);
    if (!products) return;
    
    // Descobre o slug da página atual pelo pathname ou pelo parametro na URL
    const path = window.location.pathname.replace(/\\/g, '/');
    let slug = null;

    const match = path.match(/produtos\/([^/]+)/);
    if (match) {
        slug = match[1].replace('index.html', '');
    } else if (path.includes('produto.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        slug = urlParams.get('id');
    }

    if (!slug) return;

    const product = products.find(p => p.slug === slug || p.id === slug);
    if (!product) return;

    // Título da página
    const titleEl = document.querySelector('title');
    if (titleEl && product.name) titleEl.textContent = product.name + ' — Casa da Progressiva';

    // h1 / h2 título
    const h1 = document.querySelector('.product-title, .product-info h1, .product-header h2, h1');
    if (h1) h1.textContent = product.name;

    // Preço
    const priceEl = document.querySelector('.product-price, .price .current, .price-box .price');
    if (priceEl) priceEl.innerHTML = `<sup>R$</sup>${product.price}`;
    
    // Preço Original
    const oldPriceEl = document.querySelector('.price .old, .old-price');
    if (oldPriceEl && (product.original_price || product.originalPrice)) {
      oldPriceEl.innerHTML = `R$ ${product.original_price || product.originalPrice}`;
    }

    // Imagens
    const mainImg = document.querySelector('.product-gallery img:first-child, .product-image img, .main-image img, .hero-image-inner img');
    if (mainImg) {
      let src = imgSrc(product);
      if (!src.startsWith('data:') && !src.startsWith('http') && !path.includes('produto.html')) {
        src = '../../' + src;
      }
      mainImg.src = src;
      mainImg.style.display = 'block';
      if (mainImg.nextElementSibling && (mainImg.nextElementSibling.classList.contains('hero-placeholder') || mainImg.nextElementSibling.classList.contains('result-img-placeholder'))) {
          mainImg.nextElementSibling.style.display = 'none';
      }
    }

    const secImg = document.querySelectorAll('.product-gallery img, .gallery-thumbs img, .additional-images img')[1];
    if (secImg && (product.image2Base64 || product.image2)) {
      let src2 = product.image2Base64 || product.image2;
      if (!src2.startsWith('data:') && !src2.startsWith('http') && !path.includes('produto.html')) {
        src2 = '../../' + src2;
      }
      secImg.src = src2;
    }

    // Reconstrói a seção de ofertas
    const pricingCards = document.querySelector('.pricing-inner .cards');
    if (pricingCards) {
      if (product.offers && product.offers.length > 0) {
        let html = '';
        product.offers.forEach((opt, index) => {
          const isFeatured = (product.offers.length === 3 && index === 1) || product.offers.length === 1 ? 'featured' : '';
          const featLabel = isFeatured ? '<div class="feat-label">Oferta Especial</div>' : '';
          const maxW = 'style="width: 100%; max-width: 350px;"';
          html += `
          <div class="card ${isFeatured}" ${maxW}>
            <div class="card-top">
              ${featLabel}
              <div class="card-qty" style="font-size: 1.1rem; margin-bottom: 8px;">${opt.title || product.name}</div>
              <div class="card-price"><sup>R$</sup>${opt.price}</div>
            </div>
            <div class="card-body">
              <div class="card-entrega">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                Paga somente na entrega
              </div>
              <ul class="card-list">
                <li>Frete grátis</li>
                <li>Receba e pague em casa</li>
                <li>Compra 100% segura</li>
              </ul>
              <a href="${opt.link || '#'}" class="btn-card">Pedir agora</a>
            </div>
          </div>`;
        });
        pricingCards.innerHTML = html;
        pricingCards.style.display = 'flex';
        pricingCards.style.justifyContent = 'center';
        pricingCards.style.flexWrap = 'wrap';
        pricingCards.style.gap = '24px';
      } else {
        // Se não houver ofertas específicas, mostramos o produto principal como uma oferta única
        pricingCards.innerHTML = `
        <div class="card featured" style="width: 100%; max-width: 400px; margin: 0 auto;">
          <div class="card-top">
            <div class="feat-label">Oferta Especial</div>
            <div class="card-qty" style="font-size: 1.1rem; margin-bottom: 8px;">${product.name}</div>
            <div class="card-price"><sup>R$</sup>${product.price}</div>
          </div>
          <div class="card-body">
            <div class="card-entrega">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              Paga somente na entrega
            </div>
            <ul class="card-list">
              <li>Frete grátis</li>
              <li>Receba e pague em casa</li>
              <li>Compra 100% segura</li>
            </ul>
            <a href="${product.cta_link || product.ctaLink || '#'}" class="btn-card">Pedir agora</a>
          </div>
        </div>`;
        pricingCards.style.display = 'flex';
        pricingCards.style.justifyContent = 'center';
      }
    }

    // Link do botão de compra / CTA (Pega todos os botões que sobraram, como hero e footer)
    const ctaLinks = document.querySelectorAll('.btn-buy, .btn-checkout, .btn-primary, .add-to-cart, .btn-dark, .btn-ghost, a.btn');
    const targetLink = product.cta_link || product.ctaLink;
    // Só sobrescreve se o admin tiver configurado um link de CTA específico (diferente de # ou vazio)
    if (targetLink && targetLink !== '#' && targetLink.trim() !== '') {
      ctaLinks.forEach(btn => {
         // Do not overwrite btn-card which has specific offer links
         if (btn.classList.contains('btn-card')) return; 
         if (btn.tagName === 'A') {
             btn.href = targetLink;
         } else {
             btn.setAttribute('onclick', `window.location.href='${targetLink}'`);
         }
      });
    }

    // Parcelas / Installments
    const instEl = document.querySelector('.installments, .parcelas');
    if (instEl) {
        const instVal = product.details?.installments || product.installments;
        if (instVal) instEl.textContent = instVal;
    }

    // FAQ
    const faqContainer = document.querySelector('.faq-section .faq-inner');
    if (faqContainer && product.details?.faq && product.details.faq.length > 0) {
        const faqHeader = faqContainer.querySelector('.faq-header');
        let faqHtml = faqHeader ? faqHeader.outerHTML : '';
        product.details.faq.forEach(item => {
            faqHtml += `
            <div class="faq-item">
              <button class="faq-q">${item.q}<span>+</span></button>
              <div class="faq-a">${item.a}</div>
            </div>`;
        });
        faqContainer.innerHTML = faqHtml;
        // Re-attach listeners
        faqContainer.querySelectorAll('.faq-q').forEach(btn => {
            btn.onclick = () => {
                const item = btn.closest('.faq-item');
                const isOpen = item.classList.contains('open');
                faqContainer.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
                if (!isOpen) item.classList.add('open');
            };
        });
    }

    // Timer / Countdown
    if (product.details?.countdown > 0) {
        const timerWrap = document.createElement('div');
        timerWrap.style.cssText = 'background:var(--espresso); color:#fff; padding:10px; border-radius:4px; margin-bottom:20px; text-align:center; font-weight:600; font-size:0.9rem;';
        timerWrap.innerHTML = `⏳ Oferta termina em: <span id="site-timer">00:00:00</span>`;
        if (priceEl) priceEl.parentElement.insertBefore(timerWrap, priceEl);
        
        let seconds = product.details.countdown * 3600;
        const tick = () => {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;
            const timerEl = document.getElementById('site-timer');
            if (timerEl) timerEl.textContent = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
            if (seconds > 0) { seconds--; setTimeout(tick, 1000); }
        };
        tick();
    }

    // Descrição
    const descEl = document.querySelector('.product-description, .description-content, .tab-description, p.desc, .hero-desc');
    if (descEl && product.description) descEl.innerHTML = product.description.replace(/\n/g, '<br>');

    // Badge
    const badgeEl = document.querySelector('.badge');
    if (badgeEl && product.badge) {
      badgeEl.textContent = product.badge;
      badgeEl.className = 'badge ' + (product.badgeClass || '');
    }
  }

  // ───────────────────────────────────────────
  // INICIALIZAÇÃO
  // ───────────────────────────────────────────
  function init() {
    const path = window.location.pathname.replace(/\\/g, '/');

    if (path.includes('/admin/')) return; // não interferir no painel

    if (path.endsWith('index.html') && !path.includes('/produtos/') && !path.includes('/categorias/')) {
      // Home
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', patchHome);
      } else {
        patchHome();
      }
    } else if (path.includes('/produtos/') || path.includes('produto.html')) {
      // Página de produto nativa ou virtual
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', patchProductPage);
      } else {
        patchProductPage();
      }
    } else if (path.includes('/categorias/')) {
      // Página de categoria
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', patchCategoryPage);
      } else {
        patchCategoryPage();
      }
    } else {
      // Qualquer outra (raiz, etc.) — tenta home
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', patchHome);
      } else {
        patchHome();
      }
    }
  }

  // Expõe defaults globalmente para o painel admin
  window.CdpDefaults = {
    products: DEFAULT_PRODUCTS,
    categories: DEFAULT_CATEGORIES,
    home: DEFAULT_HOME
  };

  // ──────────────────────────────────────────────
  // AI SEARCH, ORDERS & CART
  // ──────────────────────────────────────────────
  
  // 1. AI Search
  async function performAiSearch() {
    const input = document.querySelector('.search-bar input');
    const q = input?.value.trim();
    if (!q) return;

    try {
      const btn = document.querySelector('.search-bar button');
      const originalHtml = btn.innerHTML;
      btn.innerHTML = '...';

      const res = await fetch(`${API_URL}/search/ai?q=${encodeURIComponent(q)}`);
      const results = await res.json();
      
      const grid = document.querySelector('.product-grid');
      if (grid) {
        if (results.length === 0) {
          grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><h3>Nada encontrado</h3><p>Tente termos diferentes.</p></div>';
        } else {
          grid.innerHTML = results.map(p => {
            // Usamos o mapeamento para o formato que o card espera
            const starsHtml = '★'.repeat(p.stars || 5) + '☆'.repeat(5 - (p.stars || 5));
            return `
              <div class="product-card">
                <a href="${p.link || ('produto.html?id=' + p.slug)}" class="product-thumb">
                  <img src="${p.image_base64 || p.image || ''}" alt="${p.name}">
                </a>
                <div class="product-info">
                  <div class="product-stars">${starsHtml}</div>
                  <h3 class="product-title"><a href="${p.link || ('produto.html?id=' + p.slug)}">${p.name}</a></h3>
                  <div class="product-price">R$ ${p.price}</div>
                  <a href="${p.link || ('produto.html?id=' + p.slug)}" class="btn-product">Ver detalhes</a>
                </div>
              </div>
            `;
          }).join('');
        }
        grid.scrollIntoView({ behavior: 'smooth' });
      }
      btn.innerHTML = originalHtml;
    } catch (err) {
      console.error('AI Search failed:', err);
    }
  }

  // 2. Persistent Cart
  async function syncCart(productId, quantity = 1) {
    let sessionId = localStorage.getItem('cdp_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('cdp_session_id', sessionId);
    }

    try {
      await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          product_id: productId,
          quantity: quantity
        })
      });
      console.log('Cart synced with server');
    } catch (err) {
      console.log('Sync failed, using only local cart');
    }
  }

  // 3. Create Order
  async function submitOrder(orderData) {
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return await res.json();
    } catch (err) {
      console.error('Order submission failed:', err);
      return { error: 'Failed' };
    }
  }

  // Register Search Event
  function setupEvents() {
    const searchBtn = document.querySelector('.search-bar button');
    if (searchBtn) {
      searchBtn.onclick = (e) => {
        e.preventDefault();
        performAiSearch();
      };
    }
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
      searchInput.onkeydown = (e) => { if (e.key === 'Enter') performAiSearch(); };
    }
  }

  async function init() {
    await loadSiteData();
    setupEvents();
  }

  init();
})();
