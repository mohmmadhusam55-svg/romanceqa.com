// Notification System for Romance Trading
class NotificationSystem {
    constructor() {
        this.notificationSettings = this.loadSettings();
        this.init();
    }

    init() {
        this.requestNotificationPermission();
        this.setupOrderMonitoring();
    }

    loadSettings() {
        const defaultSettings = {
            browserNotifications: true,
            emailNotifications: false,
            whatsappNotifications: false,
            emailAddress: '',
            whatsappNumber: '',
            notificationSound: true,
            checkInterval: 30000 // 30 seconds
        };

        try {
            const saved = localStorage.getItem('romanceNotificationSettings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch (error) {
            console.error('Error loading notification settings:', error);
            return defaultSettings;
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('romanceNotificationSettings', JSON.stringify(this.notificationSettings));
        } catch (error) {
            console.error('Error saving notification settings:', error);
        }
    }

    async requestNotificationPermission() {
        if ('Notification' in window && this.notificationSettings.browserNotifications) {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    console.log('Browser notifications enabled');
                }
            } catch (error) {
                console.error('Error requesting notification permission:', error);
            }
        }
    }

    setupOrderMonitoring() {
        // Check for new orders every 30 seconds
        setInterval(() => {
            this.checkForNewOrders();
        }, this.notificationSettings.checkInterval);

        // Also check when admin panel loads
        this.checkForNewOrders();
    }

    checkForNewOrders() {
        try {
            const orders = JSON.parse(localStorage.getItem('romanceTradingOrders') || '[]');
            const lastChecked = localStorage.getItem('romanceLastOrderCheck');
            const lastOrderId = lastChecked || '';

            // Find new orders since last check
            const newOrders = orders.filter(order => 
                order.orderId !== lastOrderId && 
                order.timestamp > (lastChecked || '0')
            );

            if (newOrders.length > 0) {
                newOrders.forEach(order => {
                    this.sendOrderNotification(order);
                });

                // Update last checked timestamp
                const latestOrder = orders[orders.length - 1];
                if (latestOrder) {
                    localStorage.setItem('romanceLastOrderCheck', latestOrder.timestamp);
                }
            }
        } catch (error) {
            console.error('Error checking for new orders:', error);
        }
    }

    async sendOrderNotification(order) {
        const orderDetails = this.formatOrderDetails(order);

        // Browser Notification
        if (this.notificationSettings.browserNotifications && 'Notification' in window) {
            this.sendBrowserNotification(orderDetails);
        }

        // Email Notification
        if (this.notificationSettings.emailNotifications && this.notificationSettings.emailAddress) {
            await this.sendEmailNotification(orderDetails);
        }

        // WhatsApp Notification
        if (this.notificationSettings.whatsappNotifications && this.notificationSettings.whatsappNumber) {
            this.sendWhatsAppNotification(orderDetails);
        }

        // Play notification sound
        if (this.notificationSettings.notificationSound) {
            this.playNotificationSound();
        }
    }

    formatOrderDetails(order) {
        const items = order.items || [];
        const itemCount = items.reduce((total, item) => total + item.quantity, 0);
        const customerName = order.customerInfo ? order.customerInfo.name : 'Unknown Customer';

        return {
            orderId: order.orderId,
            customerName: customerName,
            total: order.total,
            itemCount: itemCount,
            paymentMethod: order.paymentMethod,
            timestamp: new Date(order.timestamp).toLocaleString(),
            items: items.map(item => `${item.name} (x${item.quantity})`).join(', ')
        };
    }

    sendBrowserNotification(orderDetails) {
        if (Notification.permission === 'granted') {
            const notification = new Notification('🛒 New Order Received!', {
                body: `Order ${orderDetails.orderId} from ${orderDetails.customerName}\nTotal: QAR ${orderDetails.total.toFixed(2)}\nItems: ${orderDetails.itemCount}`,
                icon: 'Romance logo.jpg',
                badge: 'Romance logo.jpg',
                tag: orderDetails.orderId,
                requireInteraction: true,
                actions: [
                    {
                        action: 'view',
                        title: 'View Order'
                    },
                    {
                        action: 'dismiss',
                        title: 'Dismiss'
                    }
                ]
            });

            notification.onclick = () => {
                window.focus();
                if (window.location.pathname.includes('admin.html')) {
                    // If already on admin page, refresh orders
                    if (window.adminPanel) {
                        window.adminPanel.loadOrders();
                    }
                } else {
                    // Open admin page
                    window.open('admin.html', '_blank');
                }
                notification.close();
            };

            // Auto close after 10 seconds
            setTimeout(() => {
                notification.close();
            }, 10000);
        }
    }

    async sendEmailNotification(orderDetails) {
        try {
            // Using EmailJS for email notifications
            if (typeof emailjs !== 'undefined') {
                const templateParams = {
                    order_id: orderDetails.orderId,
                    customer_name: orderDetails.customerName,
                    total_amount: orderDetails.total.toFixed(2),
                    item_count: orderDetails.itemCount,
                    payment_method: orderDetails.paymentMethod,
                    order_time: orderDetails.timestamp,
                    items_list: orderDetails.items,
                    to_email: this.notificationSettings.emailAddress
                };

                await emailjs.send(
                    'service_romance_trading', // Replace with your EmailJS service ID
                    'template_new_order', // Replace with your EmailJS template ID
                    templateParams
                );

                console.log('Email notification sent successfully');
            }
        } catch (error) {
            console.error('Error sending email notification:', error);
        }
    }

    sendWhatsAppNotification(orderDetails) {
        const message = `🛒 *New Order Received!*

📋 *Order ID:* ${orderDetails.orderId}
👤 *Customer:* ${orderDetails.customerName}
💰 *Total:* QAR ${orderDetails.total.toFixed(2)}
📦 *Items:* ${orderDetails.itemCount}
💳 *Payment:* ${orderDetails.paymentMethod}
⏰ *Time:* ${orderDetails.timestamp}

📝 *Items:* ${orderDetails.items}

Please check the admin panel for full details.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${this.notificationSettings.whatsappNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');
    }

    playNotificationSound() {
        try {
            // Create a simple notification sound
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.error('Error playing notification sound:', error);
        }
    }

    // Method to update notification settings
    updateSettings(newSettings) {
        this.notificationSettings = { ...this.notificationSettings, ...newSettings };
        this.saveSettings();
        
        if (newSettings.browserNotifications) {
            this.requestNotificationPermission();
        }
    }

    // Method to test notifications
    testNotification() {
        const testOrder = {
            orderId: 'TEST' + Date.now(),
            customerInfo: { name: 'Test Customer' },
            total: 100.00,
            items: [{ name: 'Test Product', quantity: 1 }],
            paymentMethod: 'cash',
            timestamp: new Date().toISOString()
        };

        this.sendOrderNotification(testOrder);
    }
}

// Initialize notification system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.notificationSystem = new NotificationSystem();
});
