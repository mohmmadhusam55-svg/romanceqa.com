// Category Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get category from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    
    if (!categoryId) {
        console.error('No category specified');
        showNoProducts();
        return;
    }
    
    // Find category data
    const category = window.RT_CATEGORIES.find(cat => cat.id === categoryId);
    if (!category) {
        console.error('Category not found:', categoryId);
        showNoProducts();
        return;
    }
    
    // Update page title and header
    updatePageHeader(category);
    
    // Load products for this category
    loadCategoryProducts(categoryId);
    
    // Initialize view toggle
    initializeViewToggle();
});

function updatePageHeader(category) {
    // Update page title
    document.title = `${category.name} - Romance Trading`;
    
    // Update breadcrumb
    const categoryNameElement = document.getElementById('categoryName');
    if (categoryNameElement) {
        categoryNameElement.textContent = category.name;
    }
    
    // Update category title
    const categoryTitleElement = document.getElementById('categoryTitle');
    if (categoryTitleElement) {
        categoryTitleElement.textContent = category.name;
    }
    
    // Update category description
    const categoryDescriptionElement = document.getElementById('categoryDescription');
    if (categoryDescriptionElement) {
        categoryDescriptionElement.textContent = `Browse our wide selection of ${category.name.toLowerCase()}`;
    }
}

function loadCategoryProducts(categoryId) {
    const productsGrid = document.getElementById('productsGrid');
    const productsCount = document.getElementById('productsCount');
    const noProducts = document.getElementById('noProducts');
    
    // Show loading state
    productsGrid.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';
    
    // Filter products by category
    const categoryProducts = window.RT_PRODUCTS.filter(product => product.category === categoryId);
    
    // Update products count
    if (productsCount) {
        const count = categoryProducts.length;
        productsCount.textContent = `${count} product${count !== 1 ? 's' : ''} found`;
    }
    
    // Check if no products found
    if (categoryProducts.length === 0) {
        showNoProducts();
        return;
    }
    
    // Hide no products message
    if (noProducts) {
        noProducts.style.display = 'none';
    }
    
    // Render products
    renderProducts(categoryProducts);
}

function renderProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;
    
    // Clear loading state
    productsGrid.innerHTML = '';
    
    // Create product cards
    products.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.1}s`;

    // Sanitize data just-in-time
    const numericPrice = parseFloat(String(product.price).replace(/[^0-9.]/g, ''));
    const imagePath = String(product.image).startsWith('products/') ? product.image : 'products/' + product.image;

    card.innerHTML = `
        <div class="product-media">
            <img src="${imagePath}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-badge">New</div>
        </div>
        <div class="product-body">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">QAR ${numericPrice.toFixed(2)}</div>
            <div class="product-actions">
                <button class="btn btn-secondary" onclick="viewProduct('${product.id}')">
                    View Details
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function initializeViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('productsGrid');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update grid class
            if (productsGrid) {
                if (view === 'list') {
                    productsGrid.classList.add('list-view');
                } else {
                    productsGrid.classList.remove('list-view');
                }
            }
        });
    });
}

function showNoProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const noProducts = document.getElementById('noProducts');
    const productsCount = document.getElementById('productsCount');
    
    if (productsGrid) {
        productsGrid.innerHTML = '';
    }
    
    if (noProducts) {
        noProducts.style.display = 'block';
    }
    
    if (productsCount) {
        productsCount.textContent = '0 products found';
    }
}



// Handle browser back button
window.addEventListener('popstate', function(event) {
    // Reload the page to handle category changes
    window.location.reload();
});
