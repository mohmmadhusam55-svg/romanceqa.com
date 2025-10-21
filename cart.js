// Shopping Cart Management
class Cart {
    constructor() {
        this.items = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartDisplay();
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
        const categories = window.RT_CATEGORIES || [];
        const category = categories.find(cat => cat.id === categoryId);
        if (!category) return categoryId;
        
        const currentLang = window.languageManager ? window.languageManager.getCurrentLanguage() : 'en';
        if (currentLang === 'tr' && category.nameTr) {
            return category.nameTr;
        } else if (currentLang === 'ar' && category.nameAr) {
            return category.nameAr;
        }
        return category.name;
    }

    loadCart() {
        try {
            const savedCart = localStorage.getItem('romanceTradingCart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('romanceTradingCart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showAddToCartNotification(product.name);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateCartDisplay() {
        const cartBadge = document.getElementById('cart-badge');
        if (cartBadge) {
            const itemCount = this.getItemCount();
            cartBadge.textContent = itemCount;
            cartBadge.style.display = itemCount > 0 ? 'block' : 'none';
        }

        if (window.location.pathname.includes('basket.html')) {
            this.updateCartPage();
        }
    }

    updateCartPage() {
        const cartContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartCount = document.getElementById('cart-count');
        const cartCountSummary = document.getElementById('cart-count-summary');
        const emptyCart = document.getElementById('empty-cart');
        const cartContent = document.getElementById('cart-content');

        if (!cartContainer) return;

        if (this.items.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartContent) cartContent.style.display = 'none';
            if (cartCount) cartCount.textContent = '0';
            if (cartCountSummary) cartCountSummary.textContent = '0';
            if (cartTotal) cartTotal.textContent = 'QAR 0.00';
            if (cartSubtotal) cartSubtotal.textContent = 'QAR 0.00';
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';
        if (cartContent) cartContent.style.display = 'block';
        if (cartCount) cartCount.textContent = this.getItemCount();
        if (cartCountSummary) cartCountSummary.textContent = this.getItemCount();

        // Calculate totals
        const subtotal = this.getTotal();
        const total = subtotal; // No tax calculation - prices include taxes

        // Render cart items
        cartContainer.innerHTML = this.items.map(item => {
            const productName = this.getProductName(item);
            const categoryName = this.getCategoryName(item.category);
            return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <img src="products/${item.image}" alt="${productName}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23f0f0f0\"/><text x=\"50\" y=\"50\" text-anchor=\"middle\" dy=\".3em\" fill=\"%23999\">No Image</text></svg>'">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${productName}</h4>
                    <p class="cart-item-category">${categoryName}</p>
                    <div class="price-info">
                        <span class="unit-price">QAR ${item.price.toFixed(2)} each</span>
                        <span class="item-total">Total: QAR ${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-section">
                        <label class="quantity-label">Quantity:</label>
                        <div class="quantity-controls">
                            <button class="quantity-btn minus" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})" title="Decrease quantity">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" 
                                   onchange="cart.updateQuantity('${item.id}', parseInt(this.value))" 
                                   onblur="if(this.value < 1) this.value = 1; cart.updateQuantity('${item.id}', parseInt(this.value))">
                            <button class="quantity-btn plus" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})" title="Increase quantity">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <button class="remove-btn" onclick="cart.removeItem('${item.id}')" title="Remove this item from cart">
                        <i class="fas fa-trash"></i>
                        <span>Remove</span>
                    </button>
                </div>
        </div>
        `;
        }).join('');

        // Update summary totals
        if (cartSubtotal) cartSubtotal.textContent = `QAR ${subtotal.toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = `QAR ${total.toFixed(2)}`;
    }

    showAddToCartNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'add-to-cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${productName} added to cart!</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    checkout() {
        if (this.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const subtotal = this.getTotal();
        const total = subtotal; // No tax calculation - prices include taxes

        const orderSummary = {
            items: this.items,
            subtotal: subtotal,
            total: total,
            itemCount: this.getItemCount(),
            timestamp: new Date().toISOString()
        };

        this.showPaymentMethods(orderSummary);
    }

    showPaymentMethods(orderSummary) {
        const paymentModal = document.createElement('div');
        paymentModal.className = 'payment-modal';
        paymentModal.innerHTML = `
            <div class="payment-modal-content">
                <div class="payment-header">
                    <h3><i class="fas fa-credit-card"></i> Choose Payment Method</h3>
                    <button class="close-payment-modal">&times;</button>
                </div>
                <div class="payment-options">
                    <div class="payment-option" data-method="cash">
                        <div class="payment-icon">
                            <i class="fas fa-money-bill-wave"></i>
                        </div>
                        <div class="payment-details">
                            <h4>Cash Payment</h4>
                            <p>Pay with cash upon delivery</p>
                        </div>
                    </div>
                    <div class="payment-option" data-method="iban">
                        <div class="payment-icon">
                            <i class="fas fa-university"></i>
                        </div>
                        <div class="payment-details">
                            <h4>Bank Transfer (IBAN)</h4>
                            <p>Transfer to our bank account</p>
                        </div>
                    </div>
                </div>
                <div class="order-summary-payment">
                    <h4>Order Summary</h4>
                    <div class="summary-row">
                        <span>Items:</span>
                        <span>${orderSummary.itemCount}</span>
                    </div>
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span>QAR ${orderSummary.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span>QAR ${orderSummary.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(paymentModal);

        paymentModal.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', () => {
                const method = option.dataset.method;
                this.processPayment(method, orderSummary);
                document.body.removeChild(paymentModal);
            });
        });

        paymentModal.querySelector('.close-payment-modal').addEventListener('click', () => {
            document.body.removeChild(paymentModal);
        });

        paymentModal.addEventListener('click', (e) => {
            if (e.target === paymentModal) {
                document.body.removeChild(paymentModal);
            }
        });
    }

    processPayment(method, orderSummary) {
        if (method === 'cash') {
            this.processCashPayment(orderSummary);
        } else if (method === 'iban') {
            this.processIBANPayment(orderSummary);
        }
    }

    processCashPayment(orderSummary) {
        const orders = JSON.parse(localStorage.getItem('romanceTradingOrders') || '[]');
        orderSummary.paymentMethod = 'cash';
        orderSummary.status = 'pending';
        orderSummary.orderId = 'RT' + Date.now().toString().slice(-6);
        orders.push(orderSummary);
        localStorage.setItem('romanceTradingOrders', JSON.stringify(orders));

        this.clearCart();

        alert(`Order Confirmed!\n\nOrder ID: ${orderSummary.orderId}\nTotal: QAR ${orderSummary.total.toFixed(2)}\nPayment: Cash on Delivery\n\nWe will contact you soon to arrange delivery.`);
        
        window.location.href = 'index.html';
    }

    processIBANPayment(orderSummary) {
        const ibanDetails = `
            Bank Transfer Details:
            
            Bank: Qatar National Bank (QNB)
            Account Name: Romance Trading
            IBAN: QA58QNBA000000000000000000000
            SWIFT: QNBAQAQA
            
            Amount to Transfer: QAR ${orderSummary.total.toFixed(2)}
            
            Please include your phone number in the transfer reference.
        `;

        const confirmation = confirm(`${ibanDetails}\n\nHave you completed the bank transfer?`);

        if (confirmation) {
            const orders = JSON.parse(localStorage.getItem('romanceTradingOrders') || '[]');
            orderSummary.paymentMethod = 'iban';
            orderSummary.status = 'pending';
            orderSummary.orderId = 'RT' + Date.now().toString().slice(-6);
            orders.push(orderSummary);
            localStorage.setItem('romanceTradingOrders', JSON.stringify(orders));

            this.clearCart();

            alert(`Order Confirmed!\n\nOrder ID: ${orderSummary.orderId}\nTotal: QAR ${orderSummary.total.toFixed(2)}\nPayment: Bank Transfer\n\nWe will verify your payment and contact you for delivery.`);
            
            window.location.href = 'index.html';
        }
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new Cart();
});
