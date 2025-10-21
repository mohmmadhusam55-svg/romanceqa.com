# Romance Trading - Multilingual Website

A modern, responsive website for Romance Trading with support for three languages: English, Arabic, and Turkish. Features interactive elements, smooth animations, and a beautiful user interface.

## 🌟 Features

- **Multilingual Support**: English, Arabic, and Turkish
- **Interactive Language Switcher**: Animated earth globe with smooth language transitions
- **Responsive Design**: Works perfectly on all devices
- **Modern Animations**: Smooth scroll effects, hover animations, and interactive elements
- **Beautiful UI/UX**: Clean, professional design with attention to detail
- **Contact Form**: Functional contact form with validation
- **Performance Optimized**: Fast loading and smooth interactions

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation
1. Download or clone the project files
2. Open `index.html` in your web browser
3. The website will load automatically

### File Structure
```
romance-trading-website/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🌍 Language Switching

The website features an interactive language switcher with an animated earth globe:

- **English (EN)**: Default language
- **Arabic (العربية)**: Right-to-left (RTL) layout support
- **Turkish (TR)**: Left-to-right (LTR) layout support

### How to Switch Languages
1. Hover over the earth globe in the navigation bar
2. Click on your preferred language button
3. Watch the earth animate and content change instantly
4. The website remembers your language preference

## 🎨 Interactive Elements

### Animated Buttons
- **Pulse Animation**: Hero section buttons pulse continuously
- **Glow Effect**: Secondary buttons have a subtle glow animation
- **Hover Effects**: All buttons lift up and show shadows on hover
- **Ripple Effect**: Contact form button shows ripple animation on click

### Navigation
- **Smooth Scrolling**: Click navigation links for smooth page scrolling
- **Active States**: Navigation links show active states and hover effects
- **Mobile Menu**: Responsive hamburger menu for mobile devices

### Content Sections
- **Fade-in Animations**: Content appears smoothly as you scroll
- **Hover Effects**: Cards and elements respond to user interaction
- **Parallax Effects**: Floating elements move at different speeds
- **Statistics Counter**: Numbers animate up to their target values

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All screen sizes

### Mobile Features
- Touch-friendly navigation
- Optimized layouts for small screens
- Swipe gestures support
- Fast loading on mobile networks

## 🎯 Sections Overview

### 1. Hero Section
- Welcome message with typing effect
- Call-to-action buttons
- Floating animated elements
- Background gradient

### 2. About Us
- Company description
- Animated statistics (Years, Clients, Products)
- Company image with hover effects

### 3. Products
- Product showcase with cards
- Hover animations and image scaling
- Product descriptions in multiple languages

### 4. Services
- Service offerings with icons
- Hover effects and animations
- Shimmer effect on hover

### 5. Contact
- Contact information with icons
- Functional contact form
- Interactive form elements

### 6. Footer
- Company information
- Quick links
- Social media links
- Copyright notice

## 🔧 Customization

### Colors
The website uses CSS custom properties for easy color customization. Edit the `:root` section in `styles.css`:

```css
:root {
    --primary-color: #FF6B6B;      /* Main brand color */
    --secondary-color: #4ECDC4;    /* Secondary color */
    --accent-color: #45B7D1;       /* Accent color */
    --dark-color: #2C3E50;         /* Dark text color */
    --light-color: #ECF0F1;        /* Light background color */
}
```

### Content
- Edit text content in the `translations` object in `script.js`
- Update images by replacing placeholder URLs
- Modify company information in the HTML

### Animations
- Adjust animation speeds in CSS
- Modify keyframe animations
- Change transition durations

## 📝 Adding New Languages

To add a new language:

1. Add the language to the `translations` object in `script.js`
2. Add a new language button in the HTML
3. Update the language switcher logic
4. Test RTL support if needed

Example:
```javascript
fr: {
    nav: {
        home: "Accueil",
        about: "À propos",
        // ... more translations
    }
}
```

## 🚀 Deployment

### Local Development
- Open `index.html` in your browser
- Use a local server for development (recommended)

### Web Server
- Upload all files to your web server
- Ensure proper file permissions
- Test all functionality

### CDN Integration
- Consider using CDNs for fonts and icons
- Optimize images for web
- Enable compression on your server

## 🐛 Troubleshooting

### Common Issues
1. **Language not switching**: Check browser console for JavaScript errors
2. **Animations not working**: Ensure CSS and JavaScript files are loaded
3. **Mobile menu not working**: Check for JavaScript conflicts
4. **Form not submitting**: Verify form validation and JavaScript

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📞 Support

For technical support or customization requests:
- Email: info@romanceqa.com
- Website: romanceqa.com

## 📄 License

This project is created for Romance Trading. All rights reserved.

---

**Built with ❤️ for Romance Trading**

*Last updated: December 2024*
