# anupamchugh.github.io

Modern personal site built with Next.js 16, inspired by [Jeffrey Emanuel's site](https://github.com/Dicklesworthstone/jeffrey_emanuel_personal_site).

## Features

- **Modern Stack**: Next.js 16, React 18, TypeScript, Tailwind CSS
- **Glass Morphism Design**: Beautiful dark theme with glass card effects
- **Animated Interactions**: Framer Motion for smooth scroll animations
- **84+ Blog Posts**: All existing Jekyll posts preserved and rendered
- **Static Export**: Optimized for GitHub Pages deployment
- **SEO Ready**: Meta tags, Open Graph, Twitter cards

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm start
```

## Deployment

The site auto-deploys to GitHub Pages on push to `main` via GitHub Actions.

### Manual Deployment

1. Push to `main` branch
2. GitHub Actions builds and deploys to Pages
3. Visit https://anupamchugh.github.io

### GitHub Pages Setup

1. Go to Settings > Pages
2. Set Source to "GitHub Actions"
3. The workflow will handle the rest

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Home page
│   ├── about/            # About page
│   ├── posts/            # Blog listing & individual posts
│   └── projects/         # Projects page
├── components/           # React components
│   ├── hero.tsx          # Hero section with stats
│   ├── header.tsx        # Navigation header
│   ├── footer.tsx        # Site footer
│   ├── post-card.tsx     # Blog post card
│   └── ...
├── lib/                  # Utilities and content
│   ├── content.ts        # Centralized site content
│   ├── posts.ts          # Markdown post parsing
│   └── utils.ts          # Helper functions
├── docs/_posts/          # Markdown blog posts (from Jekyll)
└── public/               # Static assets
```

## Customization

### Site Config
Edit `lib/content.ts` to update:
- Site name and description
- Navigation items
- Hero stats
- Projects
- Timeline

### Styling
- Global styles in `app/globals.css`
- Tailwind config in `tailwind.config.ts`

## Credits

Design patterns inspired by [Jeffrey Emanuel's personal site](https://jeffreyemanuel.com).
