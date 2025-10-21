# Romance Trading - Admin Panel

## Overview
The admin panel is a secure order management system for Romance Trading website owners. It allows you to view, manage, and update customer orders.

## Access Instructions

### Method 1: Direct URL Access
Navigate directly to: `admin.html`

### Method 2: Hidden Link Access
1. On any page of the website, press `Ctrl + Shift + A`
2. A small admin icon will appear in the header
3. Click the admin icon to access the admin panel

## Login Credentials
- **Password**: `romance2024`
- **Note**: Change this password in `admin.js` file for security

## Features

### Dashboard Statistics
- Total Orders
- Pending Orders  
- Completed Orders
- Total Revenue

### Order Management
- View all customer orders
- Search orders by ID, customer name, or email
- Filter orders by status (Pending, Processing, Completed, Cancelled)
- Filter orders by payment method (Cash, Bank Transfer)
- View detailed order information
- Update order status
- Add notes to orders

### Order Details Include
- Order ID and timestamp
- Customer information (name, email, phone, address)
- Complete list of ordered items with quantities
- Payment method and total amount
- Order status and notes

## Security Features
- Password-protected access
- Session-based authentication
- Admin link is hidden by default
- Secure order data storage

## How Orders Are Created
Orders are automatically created when customers complete checkout on the website. The admin panel reads from the same data storage used by the shopping cart system.

## Customization
- Change admin password in `admin.js` (line 4)
- Modify order statuses in the status filter options
- Customize the admin panel appearance in `admin-styles.css`

## Technical Details
- Uses localStorage for order storage
- Responsive design for mobile and desktop
- No server required - works entirely client-side
- Compatible with existing shopping cart system

## Support
For technical support or customization requests, contact the website developer.
