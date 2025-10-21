// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.adminPassword = '55544629'; // Admin password
        this.orders = [];
        this.filteredOrders = [];
        this.currentOrder = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuth();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Refresh button
        const refreshBtn = document.getElementById('refresh-orders');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadOrders());
        }

        // Search functionality
        const searchInput = document.getElementById('order-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Filter functionality
        const statusFilter = document.getElementById('status-filter');
        const paymentFilter = document.getElementById('payment-filter');
        const clearFilters = document.getElementById('clear-filters');

        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.applyFilters());
        }

        if (paymentFilter) {
            paymentFilter.addEventListener('change', () => this.applyFilters());
        }

        if (clearFilters) {
            clearFilters.addEventListener('click', () => this.clearFilters());
        }

        // Modal close buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal')) {
                this.closeModal();
            }
            if (e.target.classList.contains('close-status-modal')) {
                this.closeStatusModal();
            }
        });

        // Update status button
        const updateStatusBtn = document.getElementById('update-status');
        if (updateStatusBtn) {
            updateStatusBtn.addEventListener('click', () => this.openStatusModal());
        }

        // Save status button
        const saveStatusBtn = document.getElementById('save-status');
        if (saveStatusBtn) {
            saveStatusBtn.addEventListener('click', () => this.updateOrderStatus());
        }

        // Notification settings
        const saveNotificationSettings = document.getElementById('save-notification-settings');
        const resetNotificationSettings = document.getElementById('reset-notification-settings');
        const testNotification = document.getElementById('test-notification');

        if (saveNotificationSettings) {
            saveNotificationSettings.addEventListener('click', () => this.saveNotificationSettings());
        }

        if (resetNotificationSettings) {
            resetNotificationSettings.addEventListener('click', () => this.resetNotificationSettings());
        }

        if (testNotification) {
            testNotification.addEventListener('click', () => this.testNotification());
        }

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('order-modal')) {
                this.closeModal();
            }
            if (e.target.classList.contains('status-modal')) {
                this.closeStatusModal();
            }
        });
    }

    checkAuth() {
        const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
        if (isAuthenticated) {
            this.showDashboard();
            this.loadOrders();
        } else {
            this.showLogin();
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const password = document.getElementById('admin-password').value;
        const errorDiv = document.getElementById('login-error');

        if (password === this.adminPassword) {
            sessionStorage.setItem('adminAuthenticated', 'true');
            this.showDashboard();
            this.loadOrders();
            errorDiv.style.display = 'none';
        } else {
            errorDiv.style.display = 'flex';
            document.getElementById('admin-password').value = '';
        }
    }

    logout() {
        sessionStorage.removeItem('adminAuthenticated');
        this.showLogin();
        document.getElementById('admin-password').value = '';
        document.getElementById('login-error').style.display = 'none';
    }

    showLogin() {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('admin-dashboard').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        this.loadNotificationSettings();
    }

    loadOrders() {
        try {
            const savedOrders = localStorage.getItem('romanceTradingOrders');
            this.orders = savedOrders ? JSON.parse(savedOrders) : [];
            this.filteredOrders = [...this.orders];
            this.updateStatistics();
            this.renderOrders();
        } catch (error) {
            console.error('Error loading orders:', error);
            this.orders = [];
            this.filteredOrders = [];
        }
    }

    updateStatistics() {
        const totalOrders = this.orders.length;
        const pendingOrders = this.orders.filter(order => order.status === 'pending').length;
        const completedOrders = this.orders.filter(order => order.status === 'completed').length;
        const totalRevenue = this.orders.reduce((sum, order) => sum + order.total, 0);

        document.getElementById('total-orders').textContent = totalOrders;
        document.getElementById('pending-orders').textContent = pendingOrders;
        document.getElementById('completed-orders').textContent = completedOrders;
        document.getElementById('total-revenue').textContent = `QAR ${totalRevenue.toFixed(2)}`;
    }

    handleSearch(searchTerm) {
        this.applyFilters();
    }

    applyFilters() {
        const searchTerm = document.getElementById('order-search').value.toLowerCase();
        const statusFilter = document.getElementById('status-filter').value;
        const paymentFilter = document.getElementById('payment-filter').value;

        this.filteredOrders = this.orders.filter(order => {
            const matchesSearch = searchTerm === '' || 
                order.orderId.toLowerCase().includes(searchTerm) ||
                (order.customerInfo && order.customerInfo.name && order.customerInfo.name.toLowerCase().includes(searchTerm)) ||
                (order.customerInfo && order.customerInfo.email && order.customerInfo.email.toLowerCase().includes(searchTerm));

            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            const matchesPayment = paymentFilter === 'all' || order.paymentMethod === paymentFilter;

            return matchesSearch && matchesStatus && matchesPayment;
        });

        this.renderOrders();
    }

    clearFilters() {
        document.getElementById('order-search').value = '';
        document.getElementById('status-filter').value = 'all';
        document.getElementById('payment-filter').value = 'all';
        this.filteredOrders = [...this.orders];
        this.renderOrders();
    }

    renderOrders() {
        const tbody = document.getElementById('orders-tbody');
        const noOrders = document.getElementById('no-orders');
        const filteredCount = document.getElementById('filtered-orders-count');

        if (!tbody) return;

        filteredCount.textContent = this.filteredOrders.length;

        if (this.filteredOrders.length === 0) {
            tbody.innerHTML = '';
            noOrders.style.display = 'block';
            return;
        }

        noOrders.style.display = 'none';

        tbody.innerHTML = this.filteredOrders.map(order => {
            const date = new Date(order.timestamp).toLocaleDateString();
            const time = new Date(order.timestamp).toLocaleTimeString();
            const customerName = order.customerInfo ? order.customerInfo.name : 'N/A';
            const itemsCount = order.items ? order.items.length : 0;

            return `
                <tr>
                    <td class="order-id">${order.orderId}</td>
                    <td class="order-date">
                        <div>${date}</div>
                        <div style="font-size: 0.8rem; color: #999;">${time}</div>
                    </td>
                    <td class="order-customer">${customerName}</td>
                    <td class="order-items">${itemsCount} item${itemsCount !== 1 ? 's' : ''}</td>
                    <td class="order-total">QAR ${order.total.toFixed(2)}</td>
                    <td>
                        <span class="payment-method ${order.paymentMethod}">
                            ${order.paymentMethod === 'cash' ? 'Cash' : 'Bank Transfer'}
                        </span>
                    </td>
                    <td>
                        <span class="order-status ${order.status}">${order.status}</span>
                    </td>
                    <td class="order-actions">
                        <button class="action-btn view" onclick="adminPanel.viewOrder('${order.orderId}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="adminPanel.openStatusModal('${order.orderId}')" title="Update Status">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    viewOrder(orderId) {
        const order = this.orders.find(o => o.orderId === orderId);
        if (!order) return;

        this.currentOrder = order;
        this.renderOrderDetails(order);
        document.getElementById('order-modal').style.display = 'flex';
    }

    renderOrderDetails(order) {
        const detailsContainer = document.getElementById('order-details');
        if (!detailsContainer) return;

        const date = new Date(order.timestamp).toLocaleString();
        const customerInfo = order.customerInfo || {};
        const items = order.items || [];

        detailsContainer.innerHTML = `
            <div class="order-detail-section">
                <h3><i class="fas fa-info-circle"></i> Order Information</h3>
                <div class="order-info-grid">
                    <div class="order-info-item">
                        <strong>Order ID</strong>
                        ${order.orderId}
                    </div>
                    <div class="order-info-item">
                        <strong>Order Date</strong>
                        ${date}
                    </div>
                    <div class="order-info-item">
                        <strong>Payment Method</strong>
                        <span class="payment-method ${order.paymentMethod}">
                            ${order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Bank Transfer'}
                        </span>
                    </div>
                    <div class="order-info-item">
                        <strong>Status</strong>
                        <span class="order-status ${order.status}">${order.status}</span>
                    </div>
                    <div class="order-info-item">
                        <strong>Total Amount</strong>
                        QAR ${order.total.toFixed(2)}
                    </div>
                    <div class="order-info-item">
                        <strong>Items Count</strong>
                        ${items.length} item${items.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            <div class="order-detail-section">
                <h3><i class="fas fa-user"></i> Customer Information</h3>
                <div class="order-info-grid">
                    <div class="order-info-item">
                        <strong>Name</strong>
                        ${customerInfo.name || 'Not provided'}
                    </div>
                    <div class="order-info-item">
                        <strong>Email</strong>
                        ${customerInfo.email || 'Not provided'}
                    </div>
                    <div class="order-info-item">
                        <strong>Phone</strong>
                        ${customerInfo.phone || 'Not provided'}
                    </div>
                    <div class="order-info-item">
                        <strong>Address</strong>
                        ${customerInfo.address || 'Not provided'}
                    </div>
                </div>
            </div>

            <div class="order-detail-section">
                <h3><i class="fas fa-shopping-cart"></i> Order Items</h3>
                <div class="order-items-list">
                    ${items.map(item => `
                        <div class="order-item">
                            <img src="products/${item.image}" alt="${item.name}" 
                                 onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"60\" height=\"60\" viewBox=\"0 0 60 60\"><rect width=\"60\" height=\"60\" fill=\"%23f0f0f0\"/><text x=\"30\" y=\"30\" text-anchor=\"middle\" dy=\".3em\" fill=\"%23999\">No Image</text></svg>'">
                            <div class="order-item-details">
                                <div class="order-item-name">${item.name}</div>
                                <div class="order-item-category">${item.category}</div>
                                <div class="order-item-price">QAR ${item.price.toFixed(2)} each</div>
                            </div>
                            <div class="order-item-quantity">Qty: ${item.quantity}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            ${order.notes ? `
                <div class="order-detail-section">
                    <h3><i class="fas fa-sticky-note"></i> Notes</h3>
                    <div class="order-info-item">
                        <strong>Additional Notes</strong>
                        ${order.notes}
                    </div>
                </div>
            ` : ''}
        `;
    }

    openStatusModal(orderId = null) {
        if (orderId) {
            this.currentOrder = this.orders.find(o => o.orderId === orderId);
        }
        
        if (this.currentOrder) {
            document.getElementById('new-status').value = this.currentOrder.status;
        }
        
        document.getElementById('status-modal').style.display = 'flex';
    }

    closeStatusModal() {
        document.getElementById('status-modal').style.display = 'none';
        document.getElementById('status-notes').value = '';
    }

    updateOrderStatus() {
        if (!this.currentOrder) return;

        const newStatus = document.getElementById('new-status').value;
        const notes = document.getElementById('status-notes').value;

        // Update order status
        this.currentOrder.status = newStatus;
        if (notes) {
            this.currentOrder.notes = notes;
        }
        this.currentOrder.updatedAt = new Date().toISOString();

        // Save to localStorage
        const orderIndex = this.orders.findIndex(o => o.orderId === this.currentOrder.orderId);
        if (orderIndex !== -1) {
            this.orders[orderIndex] = this.currentOrder;
            localStorage.setItem('romanceTradingOrders', JSON.stringify(this.orders));
        }

        // Update display
        this.updateStatistics();
        this.applyFilters();
        this.closeStatusModal();
        this.closeModal();

        // Show success message
        this.showNotification('Order status updated successfully!', 'success');
    }

    closeModal() {
        document.getElementById('order-modal').style.display = 'none';
        this.currentOrder = null;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add notification styles if not already added
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--white);
                    padding: 1rem 1.5rem;
                    border-radius: 10px;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    z-index: 10001;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                }
                .notification.show {
                    transform: translateX(0);
                }
                .notification-success {
                    border-left: 4px solid #28a745;
                    color: #155724;
                }
                .notification-info {
                    border-left: 4px solid #17a2b8;
                    color: #0c5460;
                }
            `;
            document.head.appendChild(style);
        }

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

    // Notification Settings Methods
    loadNotificationSettings() {
        if (window.notificationSystem) {
            const settings = window.notificationSystem.notificationSettings;
            
            document.getElementById('browser-notifications').checked = settings.browserNotifications;
            document.getElementById('email-notifications').checked = settings.emailNotifications;
            document.getElementById('whatsapp-notifications').checked = settings.whatsappNotifications;
            document.getElementById('notification-sound').checked = settings.notificationSound;
            document.getElementById('email-address').value = settings.emailAddress;
            document.getElementById('whatsapp-number').value = settings.whatsappNumber;
        }
    }

    saveNotificationSettings() {
        if (window.notificationSystem) {
            const newSettings = {
                browserNotifications: document.getElementById('browser-notifications').checked,
                emailNotifications: document.getElementById('email-notifications').checked,
                whatsappNotifications: document.getElementById('whatsapp-notifications').checked,
                notificationSound: document.getElementById('notification-sound').checked,
                emailAddress: document.getElementById('email-address').value,
                whatsappNumber: document.getElementById('whatsapp-number').value
            };

            window.notificationSystem.updateSettings(newSettings);
            this.showNotification('Notification settings saved successfully!', 'success');
        }
    }

    resetNotificationSettings() {
        if (window.notificationSystem) {
            const defaultSettings = {
                browserNotifications: true,
                emailNotifications: false,
                whatsappNotifications: false,
                notificationSound: true,
                emailAddress: '',
                whatsappNumber: ''
            };

            window.notificationSystem.updateSettings(defaultSettings);
            this.loadNotificationSettings();
            this.showNotification('Notification settings reset to default!', 'success');
        }
    }

    testNotification() {
        if (window.notificationSystem) {
            window.notificationSystem.testNotification();
            this.showNotification('Test notification sent!', 'success');
        }
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});
