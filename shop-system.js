// Shop System - Full Shopping Experience
class ShopSystem {
    constructor() {
        this.products = window.RT_PRODUCTS || [];
        this.categories = window.RT_CATEGORIES || [];
        this.filteredProducts = [...this.products];
        this.currentView = 'grid';
        this.currentCollection = 'all';
        this.currentSort = 'featured';
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.displayedProducts = 0;
        this.searchTerm = '';
        
        this.filters = {
            availability: {
                inStock: true,
                outOfStock: false
            },
            price: {
                min: null,
                max: null
            }
        };
        
        this.init();
    }

    getProductName(product) {
        const currentLang = window.languageManager ? window.languageManager.getCurrentLanguage() : 'en';
        if (currentLang === 'tr' && product.nameTr) {
            return product.nameTr;
        } else if (currentLang === 'ar' && product.nameAr) {
            return product.nameAr;
        }
        return product.name;
    }

    getCategoryName(categoryId) {
        const category = this.categories.find(cat => cat.id === categoryId);
        if (!category) return categoryId;
        
        const currentLang = window.languageManager ? window.languageManager.getCurrentLanguage() : 'en';
        if (currentLang === 'tr' && category.nameTr) {
            return category.nameTr;
        } else if (currentLang === 'ar' && category.nameAr) {
            return category.nameAr;
        }
        return category.name;
    }

    init() {
        this.setupEventListeners();
        this.renderCollections();
        this.renderProducts();
        this.updateProductCount();
        this.updateMaxPrice();
        this.updateAvailabilityCounts();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('shop-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleViewToggle(e.target.dataset.view);
            });
        });

        // Collection selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.collection-item')) {
                const item = e.target.closest('.collection-item');
                this.handleCollectionClick(item.dataset.collection);
            }
        });

        // Filter controls
        const inStockFilter = document.getElementById('filter-in-stock');
        const outStockFilter = document.getElementById('filter-out-stock');
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const sortSelect = document.getElementById('sort-options');
        const clearFilters = document.getElementById('clear-filters');
        const applyFilters = document.getElementById('apply-filters');

        if (inStockFilter) {
            inStockFilter.addEventListener('change', (e) => {
                this.filters.availability.inStock = e.target.checked;
                this.updateAvailabilityCounts();
            });
        }

        if (outStockFilter) {
            outStockFilter.addEventListener('change', (e) => {
                this.filters.availability.outOfStock = e.target.checked;
                this.updateAvailabilityCounts();
            });
        }

        if (priceMin) {
            priceMin.addEventListener('input', (e) => {
                this.filters.price.min = e.target.value ? parseFloat(e.target.value) : null;
            });
        }

        if (priceMax) {
            priceMax.addEventListener('input', (e) => {
                this.filters.price.max = e.target.value ? parseFloat(e.target.value) : null;
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFilters();
            });
        }

        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        if (applyFilters) {
            applyFilters.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProducts();
            });
        }

        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart')) {
                const btn = e.target.closest('.add-to-cart');
                this.handleAddToCart(btn);
            }
        });
    }

    handleViewToggle(view) {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        this.currentView = view;
        this.renderProducts();
    }

    handleCollectionClick(collection) {
        // Update active collection
        document.querySelectorAll('.collection-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-collection="${collection}"]`).classList.add('active');

        this.currentCollection = collection;
        this.currentPage = 1;
        this.displayedProducts = 0;
        this.applyFilters();
    }

    renderCollections() {
        const collectionsList = document.getElementById('collections-list');
        if (!collectionsList) return;

        // Add "All Products" option
        let collectionsHTML = `
            <div class="collection-item active" data-collection="all">
                <span>All Products</span>
                <span class="count">${this.products.length}</span>
            </div>
        `;

        // Add category collections
        this.categories.forEach(category => {
            const categoryProducts = this.products.filter(p => p.category === category.id);
            collectionsHTML += `
                <div class="collection-item" data-collection="${category.id}">
                    <span>${category.name}</span>
                    <span class="count">${categoryProducts.length}</span>
                </div>
            `;
        });

        collectionsList.innerHTML = collectionsHTML;
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Collection filter
            const matchesCollection = this.currentCollection === 'all' || product.category === this.currentCollection;

            // Search filter
            const productName = this.getProductName(product);
            const categoryName = this.getCategoryName(product.category);
            const matchesSearch = this.searchTerm === '' || 
                productName.toLowerCase().includes(this.searchTerm) ||
                categoryName.toLowerCase().includes(this.searchTerm);

            // Availability filter (assuming all products are in stock for now)
            const isInStock = true; // You can add stock status to product data
            const matchesAvailability = (this.filters.availability.inStock && isInStock) ||
                (this.filters.availability.outOfStock && !isInStock);

            // Price filter
            const matchesPrice = (!this.filters.price.min || product.price >= this.filters.price.min) &&
                (!this.filters.price.max || product.price <= this.filters.price.max);

            return matchesCollection && matchesSearch && matchesAvailability && matchesPrice;
        });

        // Apply sorting
        this.sortProducts();

        // Reset pagination
        this.currentPage = 1;
        this.displayedProducts = 0;

        // Render products
        this.renderProducts();
        this.updateProductCount();
        this.updateLoadMoreButton();
    }

    sortProducts() {
        switch (this.currentSort) {
            case 'alphabetical-az':
                this.filteredProducts.sort((a, b) => this.getProductName(a).localeCompare(this.getProductName(b)));
                break;
            case 'alphabetical-za':
                this.filteredProducts.sort((a, b) => this.getProductName(b).localeCompare(this.getProductName(a)));
                break;
            case 'price-low-high':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high-low':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'best-selling':
                // For now, just keep original order (you can add sales data later)
                break;
            case 'date-new-old':
                // For now, just keep original order (you can add date data later)
                break;
            case 'date-old-new':
                // For now, just keep original order (you can add date data later)
                break;
            default: // 'featured'
                // Keep original order
                break;
        }
    }

    renderProducts() {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) return;

        // Clear existing products if it's the first page
        if (this.currentPage === 1) {
            productsGrid.innerHTML = '';
        }

        // Get products to display for current page
        const startIndex = this.displayedProducts;
        const endIndex = this.currentPage * this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0 && this.currentPage === 1) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3 data-lang-key="shop.no_products">No products found</h3>
                    <p data-lang-key="shop.no_products_desc">Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        // Render product cards
        productsToShow.forEach(product => {
            const productCard = this.createProductCard(product);
            productsGrid.appendChild(productCard);
        });

        this.displayedProducts += productsToShow.length;
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = `product-card ${this.currentView === 'list' ? 'list-view' : ''}`;
        card.dataset.productId = product.id;

        const categoryName = this.getCategoryName(product.category);
        const productName = this.getProductName(product);

        if (this.currentView === 'list') {
            card.innerHTML = `
                <div class="product-image">
                    <img src="products/${product.image}" alt="${productName}" 
                         onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\" viewBox=\"0 0 200 200\"><rect width=\"200\" height=\"200\" fill=\"%23f0f0f0\"/><text x=\"100\" y=\"100\" text-anchor=\"middle\" dy=\".3em\" fill=\"%23999\">No Image</text></svg>'">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${productName}</h3>
                    <p class="product-category">${categoryName}</p>
                    <div class="product-price">QAR ${product.price.toFixed(2)}</div>
                    <button class="btn btn-primary add-to-cart" 
                            data-product-id="${product.id}"
                            data-product-name="${productName}"
                            data-product-price="${product.price}"
                            data-product-image="${product.image}"
                            data-product-category="${product.category}">
                        <i class="fas fa-shopping-cart"></i> <span data-lang-key="common.add_to_cart">Add to Cart</span>
                    </button>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="product-image">
                    <img src="products/${product.image}" alt="${productName}" 
                         onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\" viewBox=\"0 0 200 200\"><rect width=\"200\" height=\"200\" fill=\"%23f0f0f0\"/><text x=\"100\" y=\"100\" text-anchor=\"middle\" dy=\".3em\" fill=\"%23999\">No Image</text></svg>'">
                    <div class="product-overlay">
                        <button class="btn btn-primary add-to-cart" 
                                data-product-id="${product.id}"
                                data-product-name="${productName}"
                                data-product-price="${product.price}"
                                data-product-image="${product.image}"
                                data-product-category="${product.category}">
                            <i class="fas fa-shopping-cart"></i> <span data-lang-key="common.add_to_cart">Add to Cart</span>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${productName}</h3>
                    <p class="product-category">${categoryName}</p>
                    <div class="product-price">QAR ${product.price.toFixed(2)}</div>
                </div>
            `;
        }

        return card;
    }

    loadMoreProducts() {
        this.currentPage++;
        this.renderProducts();
        this.updateLoadMoreButton();
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!loadMoreBtn) return;

        if (this.displayedProducts < this.filteredProducts.length) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    updateProductCount() {
        const productsCount = document.getElementById('products-count');
        if (productsCount) {
            productsCount.textContent = `${this.filteredProducts.length} products`;
        }

        const paginationInfo = document.getElementById('pagination-info');
        if (paginationInfo) {
            const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
            paginationInfo.textContent = `${this.currentPage} / ${totalPages}`;
        }
    }

    updateMaxPrice() {
        const maxPrice = Math.max(...this.products.map(p => p.price));
        const maxPriceElement = document.getElementById('max-price');
        if (maxPriceElement) {
            maxPriceElement.textContent = maxPrice.toFixed(2);
        }

        const priceMaxInput = document.getElementById('price-max');
        if (priceMaxInput) {
            priceMaxInput.placeholder = `To ${maxPrice.toFixed(2)}`;
            priceMaxInput.max = maxPrice;
        }
    }

    updateAvailabilityCounts() {
        const inStockCount = this.products.filter(p => true).length; // Assuming all are in stock
        const outStockCount = 0; // Assuming none are out of stock

        const inStockCountElement = document.getElementById('in-stock-count');
        const outStockCountElement = document.getElementById('out-stock-count');

        if (inStockCountElement) inStockCountElement.textContent = inStockCount;
        if (outStockCountElement) outStockCountElement.textContent = outStockCount;
    }

    clearAllFilters() {
        // Reset search
        const searchInput = document.getElementById('shop-search');
        if (searchInput) searchInput.value = '';
        this.searchTerm = '';

        // Reset availability filters
        const inStockFilter = document.getElementById('filter-in-stock');
        const outStockFilter = document.getElementById('filter-out-stock');
        if (inStockFilter) inStockFilter.checked = true;
        if (outStockFilter) outStockFilter.checked = false;

        // Reset price filters
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        if (priceMin) priceMin.value = '';
        if (priceMax) priceMax.value = '';

        // Reset sort
        const sortSelect = document.getElementById('sort-options');
        if (sortSelect) sortSelect.value = 'featured';

        // Reset collection
        document.querySelectorAll('.collection-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector('[data-collection="all"]').classList.add('active');

        // Reset filters object
        this.filters = {
            availability: {
                inStock: true,
                outOfStock: false
            },
            price: {
                min: null,
                max: null
            }
        };

        this.currentCollection = 'all';
        this.currentSort = 'featured';
        this.applyFilters();
    }

    handleAddToCart(btn) {
        const productData = {
            id: btn.dataset.productId,
            name: btn.dataset.productName,
            price: parseFloat(btn.dataset.productPrice),
            image: btn.dataset.productImage,
            category: btn.dataset.productCategory || 'general'
        };

        if (window.cart) {
            window.cart.addItem(productData);
            
            // Update button state
            btn.classList.add('added');
            btn.innerHTML = '<i class="fas fa-check"></i> Added';
            setTimeout(() => {
                btn.classList.remove('added');
                btn.innerHTML = '<i class="fas fa-shopping-cart"></i> <span data-lang-key="common.add_to_cart">Add to Cart</span>';
            }, 2000);
        }
    }
}

// Initialize shop system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShopSystem();
});



