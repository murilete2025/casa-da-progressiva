/* global CdpDefaults */
'use strict';

// ──────────────────────────────────────────────
// STORAGE KEYS
// ──────────────────────────────────────────────
const KEY_PRODUCTS   = 'cdp_products';
const KEY_CATEGORIES = 'cdp_categories';
const KEY_HOME       = 'cdp_home';
const KEY_SETTINGS   = 'cdp_settings';

// Detecta se está rodando local ou em produção
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:4000/api' 
  : '/api';

// ──────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────
let products   = [];
let categories = [];
let orders     = [];
let homeData   = {};
let settings   = { password: 'admin123' };

let _pendingMainImg     = null; // base64 da imagem de capa no modal
let _pendingSecImg      = null; // base64 da imagem secundaria no modal
let _pendingFeaturedImg = null; // base64 da imagem do destaque
let _heroPending        = {};   // { '0-desktop': base64, '0-mobile': base64, ... }
let _catPending         = {};   // { '0': base64 }

// ──────────────────────────────────────────────
// STORAGE HELPERS
// ──────────────────────────────────────────────
function load(key, def) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch(e) { return def; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) { alert('Erro ao salvar: ' + e.message); }
}
function genId() { return 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7); }

// ──────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────
async function initData() {
  settings = load(KEY_SETTINGS, { password: 'admin123' });

  try {
      showToast('Carregando dados do servidor...', 'info');
      
      const rProds = await fetch(`${API_URL}/products`);
      products = await rProds.json();

      const rCats = await fetch(`${API_URL}/categories`);
      categories = await rCats.json();

      const rHome = await fetch(`${API_URL}/settings/home_data`);
      const hData = await rHome.json();
      homeData = (hData && Object.keys(hData).length > 0) ? hData : (CdpDefaults ? {...CdpDefaults.home} : {});
      
      await loadOrders(); // Carrega os pedidos
      console.log('Dados carregados do servidor');
  } catch (err) {
      console.error('Erro ao carredar dados da API, usando local/defaults:', err);
      products   = load(KEY_PRODUCTS,   CdpDefaults ? [...CdpDefaults.products]   : []);
      categories = load(KEY_CATEGORIES, CdpDefaults ? [...CdpDefaults.categories] : []);
      homeData   = load(KEY_HOME,       CdpDefaults ? {...CdpDefaults.home}        : {});
      showToast('Erro ao conectar com servidor. Usando dados locais.', 'error');
  }
}

// ──────────────────────────────────────────────
// LOGIN / LOGOUT
// ──────────────────────────────────────────────
function doLogin() {
  const pwd = document.getElementById('pwd-input').value;
  if (pwd === settings.password) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    renderDashboard();
  } else {
    document.getElementById('login-error').style.display = 'block';
  }
}
document.getElementById('pwd-input').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

function doLogout() {
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('pwd-input').value = '';
  document.getElementById('login-error').style.display = 'none';
}

// ──────────────────────────────────────────────
// NAVIGATION
// ──────────────────────────────────────────────
const SECTION_TITLES = {
  dashboard: 'Dashboard',
  products: 'Produtos',
  categories: 'Categorias',
  orders: 'Pedidos',
  'home-editor': 'Editor da Home',
  settings: 'Configurações'
};

function nav(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('sec-' + section).classList.add('active');
  event.currentTarget.classList.add('active');
  document.getElementById('topbar-title').textContent = SECTION_TITLES[section] || section;
  document.getElementById('topbar-add-btn').style.display = section === 'products' ? 'flex' : 'none';

  if (section === 'dashboard')    renderDashboard();
  if (section === 'products')     renderProducts();
  if (section === 'categories')   renderCategories();
  if (section === 'orders')       renderOrders();
  if (section === 'home-editor')  renderHomeEditor();
}

// ──────────────────────────────────────────────
// DASHBOARD
// ──────────────────────────────────────────────
function renderDashboard() {
  const visible = products.filter(p => p.visible !== false).length;
  const cats    = categories.filter(c => c.active !== false).length;
  const featured = products.find(p => p.featured);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  document.getElementById('dash-stats').innerHTML = `
    <div class="stat-card"><div class="num">${products.length}</div><div class="lbl">Total de produtos</div></div>
    <div class="stat-card"><div class="num">${pendingOrders}</div><div class="lbl">Pedidos pendentes</div></div>
    <div class="stat-card"><div class="num">${cats}</div><div class="lbl">Categorias ativas</div></div>
    <div class="stat-card"><div class="num">${featured ? '1' : '0'}</div><div class="lbl">Destaque da home</div></div>
  `;

  const sorted = [...products].sort((a, b) => (a.order_index || 99) - (b.order_index || 99));
  document.getElementById('dash-table').innerHTML = sorted.map(p => `
    <tr>
      <td><strong>${p.name}</strong></td>
      <td>${p.category || '—'}</td>
      <td>R$ ${p.price}</td>
      <td>${p.featured ? '<span class="badge-pill featured">★ Sim</span>' : '—'}</td>
      <td>${p.visible !== false ? '<span class="badge-pill active">Sim</span>' : '<span class="badge-pill inactive">Não</span>'}</td>
    </tr>
  `).join('');
}

// ──────────────────────────────────────────────
// PRODUTOS
// ──────────────────────────────────────────────
function renderProducts() {
  const sorted = [...products].sort((a, b) => (a.order_index || 99) - (b.order_index || 99));
  document.getElementById('products-count').textContent = `${products.length} produto(s) cadastrado(s)`;
  document.getElementById('products-table').innerHTML = sorted.map(p => `
    <tr>
      <td><img class="thumb" src="${p.image_base64 || p.image1 || ''}" alt="" onerror="this.src='../images/placeholder.svg'"></td>
      <td><strong><a href="../${p.link || ''}" target="_blank" style="color:inherit; text-decoration:none;">${p.name}</a></strong><br><a href="../${p.link || ''}" target="_blank" class="text-muted" style="font-size: 0.8em; text-decoration: underline;">${p.link || ''}</a></td>
      <td>${p.category || '—'}</td>
      <td>R$ ${p.price}</td>
      <td>${p.badge ? `<span>${p.badge}</span>` : '—'}</td>
      <td>${p.visible !== false ? '<span class="badge-pill active">Sim</span>' : '<span class="badge-pill inactive">Não</span>'}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-secondary btn-sm" onclick="openProductModal('${p.id}')">✏️ Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">🗑 Excluir</button>
        </div>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="7" class="empty-state"><div class="icon">📦</div><p>Nenhum produto cadastrado</p></td></tr>';
}

// ──────────────────────────────────────────────
// MODAL PRODUTO
// ──────────────────────────────────────────────
function openProductModal(id) {
  _pendingMainImg = null;
  const modal = document.getElementById('product-modal-overlay');
  const cats  = categories.filter(c => c.active !== false);
  document.getElementById('pm-category').innerHTML = cats.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

  if (id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    document.getElementById('pm-title').textContent = 'Editar Produto';
    document.getElementById('pm-id').value      = p.id;
    document.getElementById('pm-name').value    = p.name || '';
    document.getElementById('pm-price').value   = p.price || '';
    document.getElementById('pm-category').value = p.category || '';
    document.getElementById('pm-cta').value     = p.cta_link || p.link || '';
    document.getElementById('pm-order').value   = p.order_index || '';
    document.getElementById('pm-desc').value    = p.description || '';
    document.getElementById('pm-visible').checked = p.visible !== false;
    document.getElementById('pm-featured').checked = !!p.featured;
    // badge
    const badgeSel = document.getElementById('pm-badge');
    const bOpt = [...badgeSel.options].find(o => o.value.startsWith(p.badge + '|'));
    badgeSel.value = bOpt ? bOpt.value : '';
    // imagem
    const prev = document.getElementById('prev-main');
    if (p.image_base64 || p.image1) {
      prev.src = p.image_base64 || p.image1;
      prev.classList.add('visible');
    } else {
      prev.classList.remove('visible');
    }
    const prevSec = document.getElementById('prev-sec');
    if (p.image2_base64 || p.image2) {
      prevSec.src = p.image2_base64 || p.image2;
      prevSec.classList.add('visible');
    } else {
      prevSec.classList.remove('visible');
    }
    
    document.getElementById('pm-offer1-title').value = p.offers?.[0]?.title || '';
    document.getElementById('pm-offer1-price').value = p.offers?.[0]?.price || '';
    document.getElementById('pm-offer1-link').value  = p.offers?.[0]?.link || '';
    
    document.getElementById('pm-offer2-title').value = p.offers?.[1]?.title || '';
    document.getElementById('pm-offer2-price').value = p.offers?.[1]?.price || '';
    document.getElementById('pm-offer2-link').value  = p.offers?.[1]?.link || '';
    
    document.getElementById('pm-offer3-price').value = p.offers?.[2]?.price || '';
    document.getElementById('pm-offer3-link').value  = p.offers?.[2]?.link || '';
    
    // Detalhes extras
    document.getElementById('pm-ben1-title').value = p.details?.ben1?.title || '';
    document.getElementById('pm-ben1-text').value  = p.details?.ben1?.text  || '';
    document.getElementById('pm-ben2-title').value = p.details?.ben2?.title || '';
    document.getElementById('pm-ben2-text').value  = p.details?.ben2?.text  || '';
    document.getElementById('pm-ben3-title').value = p.details?.ben3?.title || '';
    document.getElementById('pm-ben3-text').value  = p.details?.ben3?.text  || '';
    document.getElementById('pm-ben4-title').value = p.details?.ben4?.title || '';
    document.getElementById('pm-ben4-text').value  = p.details?.ben4?.text  || '';
    
    document.getElementById('pm-info-title').value = p.details?.infoTitle || '';
    document.getElementById('pm-info1-title').value = p.details?.info1?.title || '';
    document.getElementById('pm-info1-text').value  = p.details?.info1?.text  || '';
    document.getElementById('pm-info2-title').value = p.details?.info2?.title || '';
    document.getElementById('pm-info2-text').value  = p.details?.info2?.text  || '';
    document.getElementById('pm-info3-title').value = p.details?.info3?.title || '';
    document.getElementById('pm-info3-text').value  = p.details?.info3?.text  || '';

  } else {
    document.getElementById('pm-title').textContent = 'Novo Produto';
    document.getElementById('pm-id').value     = '';
    document.getElementById('pm-name').value   = '';
    document.getElementById('pm-price').value  = '';
    document.getElementById('pm-cta').value    = '';
    document.getElementById('pm-order').value  = '';
    document.getElementById('pm-desc').value   = '';
    document.getElementById('pm-visible').checked  = true;
    document.getElementById('pm-featured').checked = false;
    document.getElementById('pm-badge').value  = '';
    document.getElementById('prev-main').classList.remove('visible');
    document.getElementById('prev-sec').classList.remove('visible');

    document.getElementById('pm-offer1-title').value = '';
    document.getElementById('pm-offer1-price').value = '';
    document.getElementById('pm-offer1-link').value  = '';
    document.getElementById('pm-offer2-title').value = '';
    document.getElementById('pm-offer2-price').value = '';
    document.getElementById('pm-offer2-link').value  = '';
    document.getElementById('pm-offer3-title').value = '';
    document.getElementById('pm-offer3-price').value = '';
    document.getElementById('pm-offer3-link').value  = '';
    
    document.getElementById('pm-ben1-title').value = '';
    document.getElementById('pm-ben1-text').value  = '';
    document.getElementById('pm-ben2-title').value = '';
    document.getElementById('pm-ben2-text').value  = '';
    document.getElementById('pm-ben3-title').value = '';
    document.getElementById('pm-ben3-text').value  = '';
    document.getElementById('pm-ben4-title').value = '';
    document.getElementById('pm-ben4-text').value  = '';
    
    document.getElementById('pm-info-title').value = '';
    document.getElementById('pm-info1-title').value = '';
    document.getElementById('pm-info1-text').value  = '';
    document.getElementById('pm-info2-title').value = '';
    document.getElementById('pm-info2-text').value  = '';
    document.getElementById('pm-info3-title').value = '';
    document.getElementById('pm-info3-text').value  = '';
  }
  modal.classList.add('open');
}

function closeProductModal() {
  document.getElementById('product-modal-overlay').classList.remove('open');
}

function handleMainImg(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    _pendingMainImg = e.target.result;
    const prev = document.getElementById('prev-main');
    prev.src = _pendingMainImg;
    prev.classList.add('visible');
  };
  reader.readAsDataURL(file);
}

function handleSecImg(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    _pendingSecImg = e.target.result;
    const prev = document.getElementById('prev-sec');
    prev.src = _pendingSecImg;
    prev.classList.add('visible');
  };
  reader.readAsDataURL(file);
}

async function saveProduct() {
  const id    = document.getElementById('pm-id').value;
  const name  = document.getElementById('pm-name').value.trim();
  const price = document.getElementById('pm-price').value.trim();
  if (!name || !price) { showToast('Preencha nome e preço.', 'error'); return; }

  const badgeVal = document.getElementById('pm-badge').value;
  const [badgeText, badgeClass] = badgeVal ? badgeVal.split('|') : ['', ''];

  const catId = document.getElementById('pm-category').value;
  
  const ctaLink = document.getElementById('pm-cta').value.trim();
  const order   = parseInt(document.getElementById('pm-order').value) || 99;
  
  const details = {
    ben1: { title: document.getElementById('pm-ben1-title').value.trim(), text: document.getElementById('pm-ben1-text').value.trim() },
    ben2: { title: document.getElementById('pm-ben2-title').value.trim(), text: document.getElementById('pm-ben2-text').value.trim() },
    ben3: { title: document.getElementById('pm-ben3-title').value.trim(), text: document.getElementById('pm-ben3-text').value.trim() },
    ben4: { title: document.getElementById('pm-ben4-title').value.trim(), text: document.getElementById('pm-ben4-text').value.trim() },
    infoTitle: document.getElementById('pm-info-title').value.trim(),
    info1: { title: document.getElementById('pm-info1-title').value.trim(), text: document.getElementById('pm-info1-text').value.trim() },
    info2: { title: document.getElementById('pm-info2-title').value.trim(), text: document.getElementById('pm-info2-text').value.trim() },
    info3: { title: document.getElementById('pm-info3-title').value.trim(), text: document.getElementById('pm-info3-text').value.trim() }
  };

  const offers = [];
  function addOffer(n) {
      const t = document.getElementById(`pm-offer${n}-title`).value.trim();
      const p = document.getElementById(`pm-offer${n}-price`).value.trim();
      let l = document.getElementById(`pm-offer${n}-link`).value.trim();
      if (l && !l.startsWith('http') && !l.startsWith('#')) l = 'https://' + l;
      if (t || p || l) offers.push({title: t, price: p, link: l});
  }
  addOffer(1); addOffer(2); addOffer(3);

  const existingProd = id ? products.find(p => p.id == id) : {};

  const productData = {
    id: id || null,
    slug: slugify(name),
    name,
    price,
    category: catId,
    badge: badgeText,
    badge_class: badgeClass || '',
    link: 'produto.html?id=' + slugify(name),
    cta_link: ctaLink || '#',
    offers: offers,
    details: details,
    order_index: order,
    description: document.getElementById('pm-desc').value.trim(),
    visible: document.getElementById('pm-visible').checked,
    featured: document.getElementById('pm-featured').checked,
    stars: 5,
    image1: existingProd.image1 || null,
    image_base64: _pendingMainImg,
    image2: existingProd.image2 || null,
    image2_base64: _pendingSecImg
  };

  try {
      showToast('Salvando no servidor...', 'info');
      const response = await fetch(`${API_URL}/products/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
      });
      
      if (!response.ok) throw new Error('Falha ao salvar produto');
      
      const savedProd = await response.json();
      
      // Update local state
      if (id) {
          const idx = products.findIndex(p => p.id == id);
          if (idx !== -1) products[idx] = savedProd;
      } else {
          products.push(savedProd);
      }
      
      if (savedProd.featured) products.forEach(p => { if (p.id !== savedProd.id) p.featured = false; });

      save(KEY_PRODUCTS, products); // Backup local
      closeProductModal();
      renderProducts();
      renderDashboard();
      showToast('Produto salvo com sucesso no servidor!', 'success');
  } catch (err) {
      console.error(err);
      showToast('Erro ao salvar no servidor: ' + err.message, 'error');
  }
}

async function deleteProduct(id) {
  confirmDialog('Excluir produto', 'Tem certeza que deseja excluir este produto do servidor? Esta ação não pode ser desfeita.', async () => {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao excluir no servidor');
        
        products = products.filter(p => p.id != id);
        save(KEY_PRODUCTS, products);
        renderProducts();
        renderDashboard();
        showToast('Produto excluído do servidor.', 'success');
    } catch (err) {
        showToast('Erro: ' + err.message, 'error');
    }
  });
}

// ──────────────────────────────────────────────
// CATEGORIAS
// ──────────────────────────────────────────────
function renderCategories() {
  document.getElementById('cats-count').textContent = `${categories.length} categoria(s)`;
  document.getElementById('cats-table').innerHTML = categories.map(c => {
    const count = products.filter(p => p.category === c.id).length;
    return `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td><code style="font-size:.75rem;color:var(--text2)">${c.slug}</code><br><span class="text-muted">${c.link || ''}</span></td>
      <td>${count}</td>
      <td>${c.active !== false ? '<span class="badge-pill active">Ativa</span>' : '<span class="badge-pill inactive">Inativa</span>'}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-secondary btn-sm" onclick="openCatModal('${c.id}')">✏️ Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteCat('${c.id}')">🗑 Excluir</button>
        </div>
      </td>
    </tr>`;
  }).join('') || '<tr><td colspan="5"><div class="empty-state"><div class="icon">📂</div><p>Nenhuma categoria</p></div></td></tr>';
}

function openCatModal(id) {
  document.getElementById('cat-modal-overlay').classList.add('open');
  if (id) {
    const c = categories.find(x => x.id === id);
    if (!c) return;
    document.getElementById('cm-title').textContent = 'Editar Categoria';
    document.getElementById('cm-id').value     = c.id;
    document.getElementById('cm-name').value   = c.name;
    document.getElementById('cm-slug').value   = c.slug;
    document.getElementById('cm-link').value   = c.link || '';
    document.getElementById('cm-active').checked = c.active !== false;
  } else {
    document.getElementById('cm-title').textContent = 'Nova Categoria';
    document.getElementById('cm-id').value   = '';
    document.getElementById('cm-name').value = '';
    document.getElementById('cm-slug').value = '';
    document.getElementById('cm-link').value = '';
    document.getElementById('cm-active').checked = true;
  }
}
function closeCatModal() { document.getElementById('cat-modal-overlay').classList.remove('open'); }

function autoSlug() {
  const slug = slugify(document.getElementById('cm-name').value);
  document.getElementById('cm-slug').value = slug;
  document.getElementById('cm-link').value = `index.html#produtos`;
}

async function saveCat() {
  const id   = document.getElementById('cm-id').value;
  const name = document.getElementById('cm-name').value.trim();
  const slug = document.getElementById('cm-slug').value.trim() || slugify(name);
  const link = document.getElementById('cm-link').value.trim();
  const active = document.getElementById('cm-active').checked;
  if (!name) { showToast('Preencha o nome.', 'error'); return; }

  try {
      const response = await fetch(`${API_URL}/categories/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, name, slug, link, active })
      });
      if (!response.ok) throw new Error('Erro ao salvar categoria');
      
      const savedCat = await response.json();
      if (id) {
          const idx = categories.findIndex(c => c.id == id);
          if (idx !== -1) categories[idx] = savedCat;
      } else {
          categories.push(savedCat);
      }
      save(KEY_CATEGORIES, categories);
      closeCatModal();
      renderCategories();
      showToast('Categoria salva no servidor!', 'success');
  } catch (err) {
      showToast('Erro: ' + err.message, 'error');
  }
}

async function deleteCat(id) {
  confirmDialog('Excluir categoria', 'Tem certeza? Os produtos nesta categoria não serão excluídos, mas perderão a categoria.', async () => {
    try {
        const response = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao excluir categoria');
        
        categories = categories.filter(c => c.id != id);
        save(KEY_CATEGORIES, categories);
        renderCategories();
        showToast('Categoria excluída do servidor.', 'success');
    } catch (err) {
        showToast('Erro: ' + err.message, 'error');
    }
  });
}

// ──────────────────────────────────────────────
// HOME EDITOR
// ──────────────────────────────────────────────
function renderHomeEditor() {
  // Barra anuncio
  document.getElementById('he-announcement').value = homeData.announcementBar || '';

  const heroSlides = homeData.heroBanners || [];
  const heroContainer = document.getElementById('hero-banners-editor');
  
  // Helper para corrigir caminho de imagem relativo para o admin ver
  const resolveImg = (src) => {
      if (!src) return '';
      if (src.startsWith('data:') || src.startsWith('http')) return src;
      return '../' + src;
  };

  heroContainer.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const banner = heroSlides[i] || {};
    const desktopImg = banner.desktopBase64 || resolveImg(banner.desktopSrc);
    const mobileImg = banner.mobileBase64 || resolveImg(banner.mobileSrc);
    
    const div = document.createElement('div');
    div.style.cssText = 'border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:10px';
    div.innerHTML = `
      <div style="font-size:.8rem;font-weight:600;margin-bottom:10px;color:var(--text2)">Slide ${i+1}</div>
      <div class="banner-pair">
        <div>
          <div class="upload-label">Desktop (JPG/PNG)</div>
          ${desktopImg ? `<img class="current-img on" src="${desktopImg}" onerror="this.style.display='none'">` : ''}
          <div class="upload-zone" style="padding:14px">
            <input type="file" accept="image/*" onchange="handleHeroImg(event,${i},'desktop')">
            <p style="font-size:.75rem;color:var(--text2)">Trocar imagem desktop</p>
          </div>
          <img class="banner-preview" id="prev-hero-${i}-desktop">
        </div>
        <div>
          <div class="upload-label">Mobile (PNG)</div>
          ${mobileImg ? `<img class="current-img on" src="${mobileImg}" onerror="this.style.display='none'">` : ''}
          <div class="upload-zone" style="padding:14px">
            <input type="file" accept="image/*" onchange="handleHeroImg(event,${i},'mobile')">
            <p style="font-size:.75rem;color:var(--text2)">Trocar imagem mobile</p>
          </div>
          <img class="banner-preview" id="prev-hero-${i}-mobile">
        </div>
      </div>`;
    heroContainer.appendChild(div);
  }

  // Cat banners
  const catBanners = homeData.catBanners || [];
  const catContainer = document.getElementById('cat-banners-editor');
  catContainer.innerHTML = '';
  const catLabels = ['Banner 1', 'Banner 2'];
  for (let i = 0; i < 2; i++) {
    const banner = catBanners[i] || {};
    const div = document.createElement('div');
    div.style.cssText = 'border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:10px';
    const bannerImg = banner.base64 || resolveImg(banner.src);
    div.innerHTML = `
      <div style="font-size:.8rem;font-weight:600;margin-bottom:10px;color:var(--text2)">${catLabels[i]}</div>
      <div class="form-grid">
        <div class="form-group">
          <label>Título</label>
          <input type="text" class="form-control" id="cat-title-${i}" value="${banner.title || ''}">
        </div>
        <div class="form-group">
          <label>Subtítulo</label>
          <input type="text" class="form-control" id="cat-sub-${i}" value="${banner.subtitle || ''}">
        </div>
        <div class="form-group full">
          <label>Link</label>
          <input type="text" class="form-control" id="cat-link-${i}" value="${banner.link || ''}">
        </div>
        <div class="form-group full">
          ${bannerImg ? `<img class="current-img on" src="${bannerImg}" onerror="this.style.display='none'">` : ''}
          <div class="upload-zone" style="padding:14px">
            <input type="file" accept="image/*" onchange="handleCatImg(event,${i})">
            <p style="font-size:.75rem;color:var(--text2)">Trocar imagem do banner</p>
          </div>
          <img class="banner-preview" id="prev-cat-${i}">
        </div>
      </div>`;
    catContainer.appendChild(div);
  }

  // Featured product
  const featuredSel = document.getElementById('he-featured-product');
  featuredSel.innerHTML = '<option value="">Nenhum</option>' +
    products.map(p => `<option value="${p.id}" ${p.featured ? 'selected' : ''}>${p.name}</option>`).join('');
  const feat = products.find(p => p.featured);
  if (feat) {
    document.getElementById('he-featured-btn').value      = feat.featuredBtnText || '';
    document.getElementById('he-featured-title').value    = feat.featuredTitle || feat.name || '';
    document.getElementById('he-featured-subtitle').value = feat.featuredSubtitle || '';
    document.getElementById('he-featured-text').value     = feat.featuredText || feat.description || '';
    if (feat.featuredImageBase64 || feat.featuredImage) {
      const prev = document.getElementById('prev-featured');
      prev.src = feat.featuredImageBase64 || resolveImg(feat.featuredImage);
      prev.classList.add('visible');
    }
  }
}

function handleHeroImg(event, slideIdx, type) {
  const file = event.target.files[0];
  if (!file) return;
  toBase64(file, b64 => {
    _heroPending[`${slideIdx}-${type}`] = b64;
    const prev = document.getElementById(`prev-hero-${slideIdx}-${type}`);
    if (prev) { prev.src = b64; prev.classList.add('on'); }
  });
}

function handleCatImg(event, idx) {
  const file = event.target.files[0];
  if (!file) return;
  toBase64(file, b64 => {
    _catPending[idx] = b64;
    const prev = document.getElementById(`prev-cat-${idx}`);
    if (prev) { prev.src = b64; prev.classList.add('on'); }
  });
}

function handleFeaturedImg(event) {
  const file = event.target.files[0];
  if (!file) return;
  toBase64(file, b64 => {
    _pendingFeaturedImg = b64;
    const prev = document.getElementById('prev-featured');
    prev.src = b64;
    prev.classList.add('visible');
  });
}

async function saveHome() {
  // Announcement
  homeData.announcementBar = document.getElementById('he-announcement').value;

  // Hero banners
  if (!homeData.heroBanners) homeData.heroBanners = CdpDefaults.home.heroBanners.map(b => ({...b}));
  for (let i = 0; i < 3; i++) {
    if (!homeData.heroBanners[i]) homeData.heroBanners[i] = {};
    if (_heroPending[`${i}-desktop`]) homeData.heroBanners[i].desktopBase64 = _heroPending[`${i}-desktop`];
    if (_heroPending[`${i}-mobile`])  homeData.heroBanners[i].mobileBase64  = _heroPending[`${i}-mobile`];
  }

  // Cat banners
  if (!homeData.catBanners) homeData.catBanners = CdpDefaults.home.catBanners.map(b => ({...b}));
  for (let i = 0; i < 2; i++) {
    if (!homeData.catBanners[i]) homeData.catBanners[i] = {};
    homeData.catBanners[i].title    = document.getElementById(`cat-title-${i}`)?.value || '';
    homeData.catBanners[i].subtitle = document.getElementById(`cat-sub-${i}`)?.value || '';
    homeData.catBanners[i].link     = document.getElementById(`cat-link-${i}`)?.value || '';
    if (_catPending[i]) homeData.catBanners[i].base64 = _catPending[i];
  }

  try {
      showToast('Salvando home no servidor...', 'info');
      
      const response = await fetch(`${API_URL}/settings/home_data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(homeData)
      });
      if (!response.ok) throw new Error('Erro ao salvar home');
      
      homeData = await response.json();
      save(KEY_HOME, homeData);

      // Featured product (this is separate in DB as it's a product attribute)
      const featId = document.getElementById('he-featured-product').value;
      const newFeat = products.find(p => p.id == featId);
      
      if (newFeat) {
          newFeat.featured = true;
          newFeat.featuredBtnText  = document.getElementById('he-featured-btn').value;
          newFeat.featuredTitle    = document.getElementById('he-featured-title').value;
          newFeat.featuredSubtitle = document.getElementById('he-featured-subtitle').value;
          newFeat.featuredText     = document.getElementById('he-featured-text').value;
          if (_pendingFeaturedImg) newFeat.featured_image_base64 = _pendingFeaturedImg;
          
          // Save the featured product update
          await fetch(`${API_URL}/products/save`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newFeat)
          });
      }
      
      // Sync local state for other products
      products.forEach(p => { if (p.id != featId) p.featured = false; });
      save(KEY_PRODUCTS, products);

      _heroPending = {};
      _catPending  = {};
      _pendingFeaturedImg = null;

      showToast('Home atualizada com sucesso no servidor!', 'success');
  } catch (err) {
      showToast('Erro ao salvar home: ' + err.message, 'error');
  }
}

// ──────────────────────────────────────────────
// CONFIGURAÇÕES
// ──────────────────────────────────────────────
function savePwd() {
  const p1 = document.getElementById('new-pwd').value;
  const p2 = document.getElementById('new-pwd2').value;
  if (!p1) { showToast('Digite a nova senha.', 'error'); return; }
  if (p1 !== p2) { showToast('As senhas não coincidem.', 'error'); return; }
  settings.password = p1;
  save(KEY_SETTINGS, settings);
  document.getElementById('new-pwd').value  = '';
  document.getElementById('new-pwd2').value = '';
  showToast('Senha alterada com sucesso!', 'success');
}

function exportData() {
  const data = {
    products:   load(KEY_PRODUCTS,   []),
    categories: load(KEY_CATEGORIES, []),
    home:       load(KEY_HOME,       {}),
    settings:   load(KEY_SETTINGS,   {})
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'backup-casa-progressiva-' + new Date().toISOString().slice(0, 10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup exportado!', 'success');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.products)   save(KEY_PRODUCTS,   data.products);
      if (data.categories) save(KEY_CATEGORIES, data.categories);
      if (data.home)       save(KEY_HOME,       data.home);
      if (data.settings)   save(KEY_SETTINGS,   data.settings);
      initData();
      showToast('Dados importados com sucesso!', 'success');
    } catch(err) {
      showToast('Arquivo inválido.', 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function confirmReset() {
  confirmDialog('Resetar dados', 'Isso vai apagar TODOS os dados salvos e restaurar o padrão. Esta ação não pode ser desfeita!', () => {
    [KEY_PRODUCTS, KEY_CATEGORIES, KEY_HOME, KEY_SETTINGS].forEach(k => localStorage.removeItem(k));
    initData();
    showToast('Dados resetados para o padrão.', 'success');
    renderDashboard();
  });
}

// ──────────────────────────────────────────────
// CONFIRM DIALOG
// ──────────────────────────────────────────────
function confirmDialog(title, msg, onOk) {
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-msg').textContent   = msg;
  const overlay = document.getElementById('confirm-overlay');
  overlay.classList.add('open');
  const btn = document.getElementById('confirm-ok');
  btn.onclick = () => { overlay.classList.remove('open'); onOk(); };
}
function confirmCancel() { document.getElementById('confirm-overlay').classList.remove('open'); }

// ──────────────────────────────────────────────
// TOAST
// ──────────────────────────────────────────────
let _toastTimer = null;
function showToast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast ' + type + ' show';
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

// ──────────────────────────────────────────────
// UTILS
// ──────────────────────────────────────────────
function toBase64(file, cb) {
  const reader = new FileReader();
  reader.onload = e => cb(e.target.result);
  reader.readAsDataURL(file);
}

function slugify(text) {
  return (text || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}

// ──────────────────────────────────────────────
// DRAG & DROP para upload zones
// ──────────────────────────────────────────────
document.querySelectorAll('.upload-zone').forEach(zone => {
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag'));
  zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('drag'); });
});

// ──────────────────────────────────────────────
// PEDIDOS (ORDERS)
// ──────────────────────────────────────────────
async function loadOrders() {
    try {
        const res = await fetch(`${API_URL}/orders`);
        orders = await res.json();
        renderOrders();
    } catch (err) {
        showToast('Erro ao carregar pedidos', 'error');
    }
}

function renderOrders() {
    const table = document.getElementById('orders-table');
    const count = document.getElementById('orders-count');
    
    if (!orders || orders.length === 0) {
        table.innerHTML = '<tr><td colspan="6" class="empty-state">Nenhum pedido encontrado</td></tr>';
        count.textContent = '0 pedidos';
        return;
    }

    count.textContent = `${orders.length} pedido(s)`;
    table.innerHTML = orders.map(o => `
        <tr>
            <td>${new Date(o.created_at).toLocaleDateString('pt-BR')} <br> <small>${new Date(o.created_at).toLocaleTimeString('pt-BR')}</small></td>
            <td><strong>${o.customer_name}</strong> <br> ${o.customer_phone || ''}</td>
            <td>R$ ${o.total_price}</td>
            <td>${o.payment_method || 'PIX'}</td>
            <td><span class="status-badge ${o.status}">${translateStatus(o.status)}</span></td>
            <td>
                <div class="table-actions">
                    <select onchange="updateOrderStatus('${o.id}', this.value)" class="form-control" style="width: auto; padding: 2px 5px; height: 30px;">
                        <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pendente</option>
                        <option value="paid" ${o.status === 'paid' ? 'selected' : ''}>Pago</option>
                        <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Enviado</option>
                        <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Entregue</option>
                        <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
                    </select>
                </div>
            </td>
        </tr>
    `).join('');
}

async function updateOrderStatus(id, status) {
    try {
        const res = await fetch(`${API_URL}/orders/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!res.ok) throw new Error('Erro ao atualizar status');
        showToast('Status atualizado!', 'success');
        loadOrders();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function translateStatus(s) {
    const map = { pending: 'Pendente', paid: 'Pago', shipped: 'Enviado', delivered: 'Entregue', cancelled: 'Cancelado' };
    return map[s] || s;
}

// ──────────────────────────────────────────────
// BOOT
// ──────────────────────────────────────────────
initData();
