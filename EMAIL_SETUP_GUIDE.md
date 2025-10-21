# Email Notification Setup Guide

## EmailJS Setup (Recommended for Email Notifications)

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider:
   - **Gmail**: Most common choice
   - **Outlook**: Good for business emails
   - **Yahoo**: Alternative option
4. Follow the setup instructions for your chosen provider
5. Note down your **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Go to "Email Templates" in EmailJS dashboard
2. Click "Create New Template"
3. Use this template:

**Subject:**
```
🛒 New Order Received - {{order_id}}
```

**Body:**
```html
<h2>🛒 New Order Received!</h2>

<p><strong>Order Details:</strong></p>
<ul>
    <li><strong>Order ID:</strong> {{order_id}}</li>
    <li><strong>Customer:</strong> {{customer_name}}</li>
    <li><strong>Total Amount:</strong> QAR {{total_amount}}</li>
    <li><strong>Items:</strong> {{item_count}}</li>
    <li><strong>Payment Method:</strong> {{payment_method}}</li>
    <li><strong>Order Time:</strong> {{order_time}}</li>
</ul>

<p><strong>Items Ordered:</strong></p>
<p>{{items_list}}</p>

<p>Please check the admin panel for complete order details.</p>

<p>Best regards,<br>Romance Trading System</p>
```

4. Save the template and note down your **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Public Key
1. Go to "Account" in EmailJS dashboard
2. Copy your **Public Key** (e.g., `user_abc123def456`)

### Step 5: Update Notification System
1. Open `notification-system.js`
2. Find the `sendEmailNotification` method
3. Replace these values:
   ```javascript
   await emailjs.send(
       'YOUR_SERVICE_ID',        // Replace with your Service ID
       'YOUR_TEMPLATE_ID',       // Replace with your Template ID
       templateParams
   );
   ```

### Step 6: Add EmailJS Script
Add this script to your `admin.html` before the notification-system.js script:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>
    emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your Public Key
</script>
```

## Alternative Email Methods

### Method 1: SMTP Server (Advanced)
If you have your own server, you can use SMTP directly:
```javascript
// This requires a backend server
const nodemailer = require('nodemailer');
// Implementation details...
```

### Method 2: Webhook Integration
Set up webhooks with services like:
- **Zapier**: Connect to email services
- **IFTTT**: Simple automation
- **Microsoft Power Automate**: For Office 365 users

## WhatsApp Notification Setup

### Method 1: WhatsApp Business API (Recommended)
1. Apply for WhatsApp Business API
2. Get API credentials
3. Update the `sendWhatsAppNotification` method

### Method 2: WhatsApp Web Integration
The current implementation opens WhatsApp Web with a pre-filled message. This works immediately without setup.

### Method 3: Third-party Services
- **Twilio**: Professional WhatsApp API
- **MessageBird**: Alternative WhatsApp service
- **360Dialog**: WhatsApp Business solution

## Testing Your Setup

1. **Test Browser Notifications:**
   - Click "Test Notification" in admin panel
   - Allow notifications when prompted

2. **Test Email Notifications:**
   - Enable email notifications
   - Add your email address
   - Click "Test Notification"

3. **Test WhatsApp Notifications:**
   - Enable WhatsApp notifications
   - Add your WhatsApp number (with country code)
   - Click "Test Notification"

## Troubleshooting

### Browser Notifications Not Working
- Check if notifications are blocked in browser settings
- Ensure HTTPS is used (required for notifications)
- Try refreshing the page and allowing notifications again

### Email Notifications Not Working
- Verify EmailJS service is active
- Check email template variables match exactly
- Ensure public key is correct
- Check browser console for errors

### WhatsApp Notifications Not Working
- Verify phone number includes country code (e.g., +974)
- Ensure WhatsApp is installed on your device
- Check if WhatsApp Web opens correctly

## Security Notes

- Never expose EmailJS private keys in client-side code
- Use environment variables for sensitive data
- Regularly rotate API keys
- Monitor notification logs for suspicious activity

## Cost Considerations

- **EmailJS Free Plan**: 200 emails/month
- **EmailJS Paid Plans**: Start at $15/month for 1,000 emails
- **WhatsApp Business API**: Pay-per-message pricing
- **Browser Notifications**: Free (built into browsers)
