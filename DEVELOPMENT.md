# 🛠️ Development Guide - TerraRentCar

## 🚀 Quick Commands

```bash
# Development
npm run dev              # Start development server
npm run dev:clean        # Clean dist and start dev server

# Build
npm run build            # Build for production
npm run build:clean      # Clean dist and build
```

## 📋 Workflow

### 1. Development

```bash
npm run dev              # Start local development
# Make changes to your code
# Changes are automatically reflected (HMR)
```

### 2. Build & Deploy

```bash
npm run build            # Create production build
git add .                # Stage changes
git commit -m "message"  # Commit changes
git push origin new-version  # Push to GitHub
# GitHub Pages automatically deploys from new-version branch
```

## ⚠️ Important Notes

### Development vs Production

- **Development:** `http://localhost:8080/` (Vite dev server)
- **Production:** `http://terrarentcar.md/` (GitHub Pages)

### Environment Detection

- Check browser console for environment info
- Development shows "Development Mode"
- Production shows "Production Mode"

## 🔧 Useful Commands

```bash
# Clean and restart development
npm run dev:clean

# Clean and rebuild
npm run build:clean

# Check current branch
git branch

# Check GitHub Pages status
# Visit: https://github.com/PetruBurca/terrarentcar/settings/pages
```

## 🐛 Troubleshooting

### Changes not visible in development?

1. Check if you're on `new-version` branch
2. Run `npm run dev:clean`
3. Clear browser cache (Ctrl+F5)

### Production not updating?

1. Check GitHub Pages settings
2. Verify deployment from `new-version` branch
3. Wait 2-3 minutes for deployment

### Cache issues?

- Use browser's "Hard Refresh" (Ctrl+Shift+R)
- Clear browser cache manually
- Check Service Worker cache

## 🎯 GitHub Pages Setup

Your repository is configured to deploy directly from the `new-version` branch:

1. **Source:** Deploy from a branch
2. **Branch:** `new-version`
3. **Folder:** `/ (root)`
4. **Domain:** `terrarentcar.md`

This is the **correct and optimal setup** - no need for `gh-pages` branch!
