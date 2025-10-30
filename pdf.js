async function chargerProduits() {
  const response = await fetch('products.json');
  return await response.json();
}


function creerCarteProduit(prod) {
  const card = document.createElement('div');
  card.className = 'card';
  const refsHTML = prod.refs.map(r => `<p><strong>${r.ref || '-'}</strong> – ${r.weight || ''}</p>`).join('');
  card.innerHTML = `
    <img src="${prod.image}" alt="${prod.name}">
    <div><strong>${prod.name}</strong></div>
    <div class="refs">${refsHTML}</div>
  `;
  return card;
}

function creerPage(titre) {
  const page = document.createElement('div');
  page.className = 'page';
  if (titre) {
    const header = document.createElement('div');
    header.className = 'page-header';
    header.textContent = titre;
    page.appendChild(header);
  }
  return page;
}

async function genererCatalogue() {
  const produits = await chargerProduits();
  const categories = [...new Set(produits.map(p => p.category))];
  const produitsPages = document.getElementById('produits-pages');
  let pageNum = 3;

  // SOMMAIRE
  const sommaire = document.getElementById('sommaire-items');
  categories.forEach((cat, i) => {
    const div = document.createElement('div');
    div.className = 'sommaire-item';
    div.textContent = `${i+1}. ${cat}`;
    sommaire.appendChild(div);
  });

  // PAGES PRODUITS
  for (const cat of categories) {
    const produitsCat = produits.filter(p => p.category === cat);
    let page = creerPage(cat);
    let grid = document.createElement('div');
    grid.className = 'grid';
    let count = 0;

    for (const prod of produitsCat) {
      const card = creerCarteProduit(prod);
      grid.appendChild(card);
      count++;

      if (count % 6 === 0) {
        page.appendChild(grid);
        const numDiv = document.createElement('div');
        numDiv.className = 'page-number';
        numDiv.textContent = pageNum++;
        page.appendChild(numDiv);
        produitsPages.appendChild(page);

        // nouvelle page pour la catégorie
        page = creerPage(cat);
        grid = document.createElement('div');
        grid.className = 'grid';
      }
    }

    // reste des cartes
    if (grid.children.length > 0) {
      page.appendChild(grid);
      const numDiv = document.createElement('div');
      numDiv.className = 'page-number';
      numDiv.textContent = pageNum++;
      page.appendChild(numDiv);
      produitsPages.appendChild(page);
    }
  }
}

genererCatalogue();