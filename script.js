const PRODUCTS_PER_PAGE = 100;
let products = [];
let filteredProducts = [];
let currentPage = 1;

// Charger les produits
fetch('products.json')
  .then(res => res.json())
  .then(data => {
    products = data;
    filteredProducts = data;
    renderCategories();
    renderPage(1);
  });

// Générer le menu catégories
function renderCategories() {
  const categories = [...new Set(products.map(p => p.category))];
  const container = document.getElementById('categories');
  container.classList.add('categories');
  container.innerHTML = `
    <button onclick="filterCategory('all')" class="active">Tous</button>
    ${categories.map(cat => `<button onclick="filterCategory('${cat}')">${cat}</button>`).join('')}
  `;
}

// Filtrer par catégorie
function filterCategory(cat) {
  const buttons = document.querySelectorAll('#categories button');
  buttons.forEach(btn => btn.classList.remove('active'));

  const activeBtn = [...buttons].find(b => b.textContent === cat || (cat === 'all' && b.textContent === 'Tous'));
  if (activeBtn) activeBtn.classList.add('active');

  filteredProducts = cat === 'all' ? products : products.filter(p => p.category === cat);
  renderPage(1);
}

// Afficher les produits et la pagination
function renderPage(page) {
  const catalogue = document.getElementById('catalogue');
  const pagination = document.getElementById('pagination');
  currentPage = page;

  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;
  const paginated = filteredProducts.slice(start, end);

  // Produits
  catalogue.innerHTML = paginated.map(p => `
    <div class="col-sm-6 col-md-4 col-lg-3">
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}" class="product-img" data-name="${p.name}" data-bs-toggle="modal" data-bs-target="#imageModal">
        <h5>${p.name}</h5>
        <ul>
          ${p.refs.map(r => `<li>${r.ref} - ${r.weight}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  if (totalPages <= 1) {
    pagination.innerHTML = '';
  } else {
    let paginationHTML = `
      <button class="arrow" ${page === 1 ? 'disabled' : ''} onclick="renderPage(${page - 1})">&lt;</button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `<button class="${i === page ? 'active' : ''}" onclick="renderPage(${i})">${i}</button>`;
    }

    paginationHTML += `
      <button class="arrow" ${page === totalPages ? 'disabled' : ''} onclick="renderPage(${page + 1})">&gt;</button>
    `;

    pagination.innerHTML = paginationHTML;
  }

  // Attacher les événements d’ouverture de modal
  addModalListeners();
}

// Fonction pour gérer l'ouverture de la modal
function addModalListeners() {
  const images = document.querySelectorAll('.product-img');
  const modalImg = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');

  images.forEach(img => {
    img.addEventListener('click', () => {
      modalImg.src = img.src;
      modalTitle.textContent = img.dataset.name;
    });
  });
}