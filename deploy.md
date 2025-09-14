# MindCare Web App - Build & Deployment Guide

## 🚀 Quick Build & Run

### Method 1: Using the Build Script (Windows)
1. **Double-click `build.bat`** in the project folder
2. The script will automatically:
   - Detect Python or Node.js
   - Start a local server
   - Open your browser to the app
3. **Test the app** at `http://localhost:8000` or `http://localhost:3000`

### Method 2: Manual Setup

#### Option A: Python (Recommended)
```bash
cd project
python -m http.server 8000
```
Open: `http://localhost:8000`

#### Option B: Node.js
```bash
cd project
npm install -g serve
npm start
```
Open: `http://localhost:3000`

#### Option C: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

## 📋 Pre-Deployment Checklist

### ✅ File Structure Verification
- [ ] All HTML files present (11 pages)
- [ ] All JavaScript files present (12 JS files)
- [ ] CSS files present (styles.css, styles-extended.css)
- [ ] PWA files present (manifest.json, sw.js, pwa.js)
- [ ] README.md and package.json created

### ✅ Local Testing
- [ ] App loads without errors in browser console
- [ ] Navigation between pages works
- [ ] Login/signup functionality works
- [ ] Crisis support features function
- [ ] Wellness dashboard displays correctly
- [ ] PWA features work (service worker registers)
- [ ] Emergency dial button appears on all pages

## 🌐 Deployment Options

### Option 1: GitHub Pages (Free)
1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial MindCare PWA commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/mindcare-pwa.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: main
   - Folder: / (root)
   - Click Save

3. **Access Your App**
   - URL: `https://yourusername.github.io/mindcare-pwa`
   - Wait 5-10 minutes for deployment

### Option 2: Netlify (Free)
1. **Drag & Drop Deployment**
   - Visit [netlify.com](https://netlify.com)
   - Drag the entire project folder to Netlify
   - Get instant deployment URL

2. **Git Integration** (Optional)
   - Connect your GitHub repository
   - Automatic deployments on push

### Option 3: Vercel (Free)
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd project
   vercel
   ```
   - Follow prompts
   - Get instant deployment URL

### Option 4: Firebase Hosting (Free)
1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize and Deploy**
   ```bash
   firebase login
   firebase init hosting
   firebase deploy
   ```

## 🧪 Post-Deployment Testing

### Desktop Testing
- [ ] Open deployed URL in Chrome, Firefox, Edge
- [ ] Test PWA installation prompt
- [ ] Verify offline functionality
- [ ] Test all navigation and features
- [ ] Check browser console for errors

### Mobile Testing
- [ ] Open on Android Chrome
- [ ] Test "Add to Home Screen"
- [ ] Open on iOS Safari
- [ ] Test "Add to Home Screen"
- [ ] Verify touch interactions work
- [ ] Test emergency dial functionality

### PWA Validation
- [ ] Use Chrome DevTools → Lighthouse → PWA audit
- [ ] Score should be 90+ for PWA criteria
- [ ] Service worker registers successfully
- [ ] Manifest is valid
- [ ] App works offline

## 🔧 Troubleshooting

### Common Issues

**PWA Not Installing**
- Ensure HTTPS (required for PWA)
- Check manifest.json is accessible
- Verify service worker registration

**Files Not Loading**
- Check file paths are relative
- Ensure all files uploaded correctly
- Verify MIME types for CSS/JS files

**Emergency Features Not Working**
- Test on HTTPS only (required for geolocation/calls)
- Check browser permissions
- Verify emergency-dial.js is loaded

### Performance Optimization
- All files are already optimized for production
- No build step required (vanilla JS/CSS/HTML)
- Service worker handles caching automatically

## 📱 PWA Installation Instructions

### For Users - Desktop
1. Visit the deployed app URL
2. Look for install icon in address bar
3. Click "Install MindCare"
4. App appears in Start Menu/Applications

### For Users - Mobile
**Android:**
1. Open in Chrome
2. Tap menu → "Add to Home screen"
3. Confirm installation

**iOS:**
1. Open in Safari
2. Tap Share → "Add to Home Screen"
3. Confirm installation

## 🎯 Success Metrics

Your deployment is successful when:
- ✅ App loads on deployed URL
- ✅ PWA installs on mobile/desktop
- ✅ Works offline after first load
- ✅ Emergency features function
- ✅ All pages navigate correctly
- ✅ Data persists in localStorage
- ✅ Lighthouse PWA score > 90

## 🔒 Security Notes

- App uses HTTPS (required for PWA)
- All data stored locally (no server)
- No API keys or secrets exposed
- Emergency features work offline

## 📞 Emergency Contact Customization

Before deployment, update emergency contacts in `crisis-support.js`:
```javascript
// Update these numbers for your region
const emergencyContacts = [
    { name: "Emergency Services", number: "911", type: "call" },
    { name: "Crisis Hotline", number: "988", type: "call" },
    { name: "Local Crisis Center", number: "YOUR-LOCAL-NUMBER", type: "call" }
];
```

---

**Your MindCare PWA is now ready for deployment! 🚀**
