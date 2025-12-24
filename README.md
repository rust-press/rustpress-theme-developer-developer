# Developer Developer Theme

A modern, customizable magazine-style theme for RustPress. Features a clean design, dark mode support, e-commerce integration, and comprehensive template coverage.

## Features

- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Dark Mode**: Automatic detection + manual toggle
- **E-commerce Ready**: Shop, product, and cart templates
- **SEO Optimized**: Open Graph, Twitter Cards, Schema.org markup
- **Accessibility**: ARIA labels, keyboard navigation, skip links
- **Customizable**: CSS variables, configurable components, theme.json settings
- **Performance**: Lazy loading, optimized assets, minimal JavaScript

## Installation

1. Copy the `developer-developer` folder to your RustPress `themes/` directory
2. Update your site configuration to use this theme:
   ```toml
   [site]
   theme = "developer-developer"
   ```
3. Restart your RustPress server

## Theme Structure

```
developer-developer/
├── assets/
│   ├── css/
│   │   ├── style.css       # Main stylesheet
│   │   ├── responsive.css  # Responsive breakpoints
│   │   └── dark-mode.css   # Dark mode styles
│   └── js/
│       ├── theme.js        # Main theme JavaScript
│       ├── navigation.js   # Navigation functionality
│       └── search.js       # Search functionality
├── layouts/
│   └── base.html           # Base layout template
├── templates/
│   ├── partials/
│   │   ├── header.html     # Site header
│   │   ├── footer.html     # Site footer
│   │   ├── sidebar.html    # Sidebar widgets
│   │   ├── mobile-menu.html
│   │   └── search-overlay.html
│   ├── home.html           # Homepage
│   ├── single.html         # Single post/article
│   ├── page.html           # Static pages
│   ├── archive.html        # Category/tag/date archives
│   ├── search.html         # Search results
│   ├── author.html         # Single author page
│   ├── authors.html        # Authors listing
│   ├── categories.html     # Categories listing
│   ├── about.html          # About page
│   ├── contact.html        # Contact page
│   ├── shop.html           # Products listing
│   ├── product.html        # Single product
│   ├── cart.html           # Shopping cart
│   ├── 404.html            # 404 error page
│   └── 500.html            # 500 error page
├── theme.json              # Theme configuration
└── README.md               # This file
```

## Available Templates (15+ pages)

| Template | Purpose |
|----------|---------|
| `home.html` | Homepage with hero, featured posts, categories |
| `single.html` | Blog posts and articles |
| `page.html` | Static pages with flexible layouts |
| `archive.html` | Category, tag, and date archives |
| `search.html` | Search results page |
| `author.html` | Individual author profile |
| `authors.html` | Authors listing page |
| `categories.html` | Categories listing page |
| `about.html` | About page with team section |
| `contact.html` | Contact form with map and FAQ |
| `shop.html` | Product listing with filters |
| `product.html` | Single product page |
| `cart.html` | Shopping cart |
| `404.html` | 404 Not Found page |
| `500.html` | Server Error page |

## Customization

### Theme Configuration (theme.json)

The `theme.json` file controls all theme settings:

```json
{
  "name": "Developer Developer",
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#8B5CF6"
  },
  "fonts": {
    "heading": "Inter",
    "body": "Inter"
  },
  "features": {
    "darkMode": true,
    "stickyHeader": true,
    "backToTop": true
  }
}
```

### CSS Variables

Customize colors, spacing, and typography in `style.css`:

```css
:root {
  /* Colors */
  --color-primary: #3B82F6;
  --color-secondary: #8B5CF6;

  /* Typography */
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  /* ... */

  /* Layout */
  --container-width: 1280px;
  --sidebar-width: 320px;
}
```

### Header Customization

Edit `templates/partials/header.html` to customize:
- Logo and site name
- Navigation menu structure
- Top bar content
- Header buttons and actions

### Footer Customization

Edit `templates/partials/footer.html` to customize:
- Footer columns and widgets
- Social media links
- Copyright text
- Newsletter signup form

### Sidebar Widgets

Edit `templates/partials/sidebar.html` to add/remove widgets:
- Search box
- About widget
- Categories list
- Recent posts
- Tags cloud
- Newsletter signup
- Social links
- Custom widgets

## Template Variables

### Site Variables
- `site.name` - Site name
- `site.description` - Site description
- `site.url` - Site URL
- `site.logo` - Logo URL
- `site.social.*` - Social media URLs

### Page Variables
- `page.title` - Page title
- `page.content` - Page content (HTML)
- `page.excerpt` - Page excerpt
- `page.featured_image` - Featured image URL
- `page.date` - Publication date
- `page.author` - Author object

### Post Variables
- `post.title` - Post title
- `post.content` - Post content
- `post.excerpt` - Post excerpt
- `post.featured_image` - Featured image
- `post.category` - Category object
- `post.tags` - Array of tags
- `post.author` - Author object
- `post.reading_time` - Estimated reading time

### Product Variables
- `product.name` - Product name
- `product.description` - Product description
- `product.price` - Regular price
- `product.sale_price` - Sale price
- `product.images` - Array of images
- `product.category` - Product category
- `product.stock` - Stock quantity
- `product.sku` - SKU code

## Dark Mode

The theme supports dark mode in two ways:

1. **Automatic**: Respects `prefers-color-scheme` media query
2. **Manual**: Toggle button in the header

To customize dark mode colors, edit `assets/css/dark-mode.css`.

## Responsive Breakpoints

```css
/* Small devices */
@media (max-width: 640px) { }

/* Medium devices */
@media (max-width: 768px) { }

/* Large devices */
@media (max-width: 1024px) { }

/* Extra large devices */
@media (max-width: 1280px) { }
```

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Contributing

Contributions are welcome! Please ensure your changes:
- Follow the existing code style
- Include responsive styles
- Support dark mode
- Maintain accessibility standards

## License

MIT License - feel free to use this theme for personal and commercial projects.

## Credits

- Icons: [Feather Icons](https://feathericons.com/)
- Fonts: [Inter](https://rsms.me/inter/)
