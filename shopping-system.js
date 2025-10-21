// Shopping System JavaScript
class ShoppingSystem {
    constructor() {
        this.products = window.RT_PRODUCTS || [];
        this.categories = window.RT_CATEGORIES || [];
        this.filteredProducts = [...this.products];
        this.currentCategory = 'all';
        this.currentSearch = '';
        this.currentView = 'products';
        this.productsPerPage = 12;
        this.currentPage = 1;
        this.displayedProducts = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderProducts();
        this.updateCartBadge();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value.toLowerCase();
                this.currentPage = 1;
                this.displayedProducts = 0;
                this.filterProducts();
                this.renderProducts();
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


    filterProducts() {
        this.filteredProducts = this.products.filter(product => {
            const matchesCategory = this.currentCategory === 'all' || product.category === this.currentCategory;
            const matchesSearch = this.currentSearch === '' || 
                product.name.toLowerCase().includes(this.currentSearch) ||
                product.category.toLowerCase().includes(this.currentSearch);
            return matchesCategory && matchesSearch;
        });
    }


    renderProducts() {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) return;

        const startIndex = 0;
        const endIndex = Math.min(this.currentPage * this.productsPerPage, this.filteredProducts.length);
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (this.currentPage === 1) {
            productsGrid.innerHTML = '';
        }

        productsToShow.forEach(product => {
            const productCard = this.createProductCard(product);
            productsGrid.appendChild(productCard);
        });

        this.displayedProducts = productsToShow.length;
        this.updateLoadMoreButton();
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.productId = product.id;

        const categoryName = product.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        card.innerHTML = `
            <div class="product-image">
                <img src="products/${product.image}" alt="${product.name}" 
                     onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\" viewBox=\"0 0 200 200\"><rect width=\"200\" height=\"200\" fill=\"%23f0f0f0\"/><text x=\"100\" y=\"100\" text-anchor=\"middle\" dy=\".3em\" fill=\"%23999\">No Image</text></svg>'">
                <div class="product-overlay">
                    <button class="btn btn-primary add-to-cart" 
                            data-product-id="${product.id}"
                            data-product-name="${product.name}"
                            data-product-price="${product.price}"
                            data-product-image="${product.image}"
                            data-product-category="${product.category}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${categoryName}</p>
                <div class="product-price">QAR ${product.price.toFixed(2)}</div>
            </div>
        `;

        return card;
    }

    loadMoreProducts() {
        this.currentPage++;
        this.renderProducts();
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!loadMoreBtn) return;

        const hasMoreProducts = this.displayedProducts < this.filteredProducts.length;
        loadMoreBtn.style.display = hasMoreProducts ? 'block' : 'none';
    }


    handleAddToCart(btn) {
        const productId = btn.dataset.productId;
        const productName = btn.dataset.productName;
        const productPrice = parseFloat(btn.dataset.productPrice);
        const productImage = btn.dataset.productImage;
        const productCategory = btn.dataset.productCategory;

        // Add to cart using the global cart object
        if (window.cart) {
            window.cart.addItem({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                category: productCategory,
                quantity: 1
            });

            // Update button state
            btn.innerHTML = '<i class="fas fa-check"></i> Added!';
            btn.classList.add('added');
            btn.disabled = true;

            // Reset button after 2 seconds
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                btn.classList.remove('added');
                btn.disabled = false;
            }, 2000);

            // Update cart badge
            this.updateCartBadge();
        }
    }

    updateCartBadge() {
        const cartBadge = document.getElementById('cart-badge');
        if (cartBadge && window.cart) {
            const itemCount = window.cart.getItemCount();
            cartBadge.textContent = itemCount;
            cartBadge.style.display = itemCount > 0 ? 'block' : 'none';
        }
    }
}

// Initialize shopping system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShoppingSystem();
});
