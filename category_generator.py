
import json
import os

def get_data():
    with open('products-data.js', 'r') as f:
        content = f.read()
        # A bit of a hack to get the JS object into a Python dict
        # This is fragile and depends on the structure of the JS file
        categories_str = content.split('window.RT_CATEGORIES = ')[1].split(';')[0]
        products_str = content.split('window.RT_PRODUCTS = ')[1].split(';')[0]
        
        # Using json.loads after some string manipulation to make it valid JSON
        categories = json.loads(categories_str.replace("'", '"'))
        products = json.loads(products_str.replace("'", '"'))
        
        return categories, products

def create_category_page(category, products):
    category_id = category['id']
    category_name = category['name']
    
    product_cards_html = ''
    for product in products:
        product_cards_html += f""
            <div class="product-card">
                <img src="products/{product['image']}" alt="{product['name']}" class="product-image">
                <div class="product-content">
                    <h3 class="product-title">{product['name']}</h3>
                    <p class="product-price">QAR {product['price']}</p>
                </div>
            </div>
        "

    html_template = f""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#5dbc5e">
    <title>{category_name} - Romance Trading</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="new_styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@100..900&display=swap" rel="stylesheet">
</head>
<body>
    <div class="left-line"></div>
    <div class="right-line"></div>
    <!-- Top Header -->
    <header class="top-header light-header" role="banner">
        <div class="container header-row">
            <a href="index.html" class="logo-link header-logo-link" aria-label="Romance Trading home">
                <img src="Romance logo.jpg" alt="Romance Trading logo" class="site-logo header-site-logo">
            </a>
            <div class="header-left">
                <div class="header-search">
                    <input type="search" placeholder="Search..." aria-label="Search site" id="site-search" data-lang-key="search.placeholder">
                </div>
            </div>
            <div class="header-right">

                <nav class="icon-nav" role="navigation" aria-label="Icon navigation">
                    <a href="index.html#home" class="icon-link" title="Home"><i class="fas fa-home"></i><span data-lang-key="nav.home">Home</span></a>
                    <a href="index.html#about" class="icon-link" title="About Us"><i class="fas fa-info-circle"></i><span data-lang-key="nav.about">About Us</span></a>
                    <a href="index.html#products" class="icon-link" title="Products"><i class="fas fa-th-large"></i><span data-lang-key="nav.products">Products</span></a>
                    <a href="index.html#contact" class="icon-link" title="Contact Us"><i class="fas fa-envelope"></i><span data-lang-key="nav.contact">Contact Us</span></a>
                </nav>
                <div class="auth-actions language-actions">
                    <div class="lang-dropdown header-lang">
                        <button class="lang-toggle" aria-label="Open language menu"><i class="fas fa-globe"></i> ▾</button>
                        <div class="lang-menu" aria-hidden="true">
                            <button class="lang-item" data-lang="en"><i class="fas fa-language"></i> English</button>
                            <button class="lang-item" data-lang="ar"><i class="fas fa-language"></i> العربية</button>
                            <button class="lang-item" data-lang="tr"><i class="fas fa-language"></i> Türkçe</button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </header>

    <!-- Products Section -->
    <section id="category-products" class="products">
        <div class="container">
            <div class="products-header">
                <h1 class="section-title">{category_name}</h1>
            </div>
            
            <!-- Products Grid -->
            <div id="products-grid" class="products-grid">
                {product_cards_html}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-bottom">
                <p>&copy; 2024 Romance Trading. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Sticky Cart Icon -->
    <a href="basket.html" class="sticky-cart-icon">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-badge" id="cart-badge">0</span>
    </a>

    <script src="cart.js"></script>
    <script src="script.js"></script>
</body>
</html>
    "
    
    with open(f'{category_id}.html', 'w') as f:
        f.write(html_template)

def main():
    categories, all_products = get_data()
    for category in categories:
        products_in_category = [p for p in all_products if p['category'] == category['id']]
        create_category_page(category, products_in_category)
    print(f"Successfully generated {len(categories)} category pages.")

if __name__ == "__main__":
    main()
