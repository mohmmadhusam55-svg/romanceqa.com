
// ==== Category page generator ====
(function(){
    const container = document.querySelector('#category-products');
    if(!container) return;

    const categoryId = window.location.pathname.split('/').pop().replace('.html', '');

    const category = window.RT_CATEGORIES.find(cat => cat.id === categoryId);

    if (!category) {
        container.innerHTML = '<p>Category not found.</p>';
        return;
    }

    document.title = category.name + ' - Romance Trading';

    // Build wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'category-products-wrapper';

    // Main column
    const main = document.createElement('div');
    main.innerHTML = `
        <h2 class="category-headline">${category.name}</h2>
        <div class="products-toolbar">
            <div class="toolbar-left">
                <a href="retail.html" class="btn btn-primary">Back to Retail</a>
            </div>
            <div class="toolbar-center">
                <span id="itemCount"></span>
            </div>
            <div class="toolbar-right">
                <div class="view-toggle" role="tablist">
                    <button class="toggle btn btn-secondary active" data-view="grid">Grid</button>
                    <button class="toggle btn btn-secondary" data-view="list">List</button>
                </div>
            </div>
        </div>
        <div id="viewerGrid" class="products-grid viewer"></div>
    `;

    wrapper.appendChild(main);
    container.appendChild(wrapper);

    // Data
    const products = window.RT_PRODUCTS.filter(p => p.category === categoryId);

    // Render products
    const grid = main.querySelector('#viewerGrid');
    let currentView = 'grid';
    function renderProducts(){
        grid.className = currentView === 'grid' ? 'products-grid viewer' : 'products-grid viewer list-view';
        grid.innerHTML = products.map(p => cardHtml(p)).join('');
        main.querySelector('#itemCount').textContent = `${products.length} items`;
    }

    function cardHtml(p){
        const numericPrice = parseFloat(String(p.price).replace(/[^0-9.]/g, ''));
        const imagePath = String(p.image).startsWith('products/') ? p.image : 'products/' + p.image;

        return `
            <div class="product-card viewer">
                <div class="product-media" role="img" aria-label="${p.name}">
                    <img src="${imagePath}" alt="${p.name}" style="width:70%;height:100px;object-fit:contain;"/>
                </div>
                <div class="product-body">
                    <div style="display:flex;align-items:center;gap:.5rem">
                        <div class="product-title">${p.name}</div>
                        <div class="price">QAR ${numericPrice.toFixed(2)}</div>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-basket" 
                                data-product-id="${p.id}" 
                                data-product-name="${p.name}" 
                                data-product-price="${numericPrice}" 
                                data-product-image="${imagePath}">
                            Add to Basket
                        </button>
                    </div>
                </div>
            </div>`;
    }

    // View toggles
    main.querySelectorAll('.view-toggle .toggle').forEach(btn=>{
        btn.addEventListener('click', ()=>{
            main.querySelectorAll('.view-toggle .toggle').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            renderProducts();
        });
    });

    renderProducts();
})();
