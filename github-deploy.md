# Deploy MindCare to GitHub Pages

## 🚀 Step-by-Step GitHub Deployment

### Step 1: Create GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click **"New repository"** (green button)
3. Repository name: `mindcare` (or your preferred name)
4. Description: `MindCare - Student Mental Health Support PWA`
5. Set to **Public** (required for free GitHub Pages)
6. ✅ Check **"Add a README file"**
7. Click **"Create repository"**

### Step 2: Upload Your Files

#### Option A: GitHub Web Interface (Easiest)
1. In your new repository, click **"uploading an existing file"**
2. **Drag and drop** all files from your `project` folder:
   ```
   ✅ All .html files (index.html, dashboard.html, etc.)
   ✅ All .js files (auth.js, dashboard.js, etc.)
   ✅ All .css files (styles.css, styles-extended.css)
   ✅ manifest.json, sw.js, pwa.js
   ✅ README.md, package.json
   ✅ .gitignore
   ```
3. Scroll down, add commit message: `Initial MindCare PWA deployment`
4. Click **"Commit changes"**

#### Option B: Git Command Line
```bash
# In your project folder
git init
git add .
git commit -m "Initial MindCare PWA deployment"
git branch -M main
git remote add origin https://github.com/koulik07/mindcare.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. In your repository, go to **Settings** tab
2. Scroll down to **"Pages"** in the left sidebar
3. Under **"Source"**, select:
   - **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
4. Click **"Save"**
5. ✅ GitHub will show: **"Your site is published at https://YOUR-USERNAME.github.io/mindcare-pwa"**

### Step 4: Wait for Deployment
- ⏱️ Initial deployment takes **5-10 minutes**
- Check the **Actions** tab to see deployment progress
- Green checkmark = successful deployment

## 🌐 Access Your Live App

Your MindCare PWA will be available at:
```
https://YOUR-USERNAME.github.io/mindcare-pwa
```

Replace `YOUR-USERNAME` with your actual GitHub username.

## 📱 Test Your Deployed App

### Desktop Testing
1. Open the GitHub Pages URL in Chrome/Firefox/Edge
2. ✅ Verify all pages load correctly
3. ✅ Test PWA installation (install icon in address bar)
4. ✅ Check browser console for errors (F12)
5. ✅ Test offline functionality (disconnect internet)

### Mobile Testing
1. Open URL on your phone
2. ✅ **Android Chrome**: Menu → "Add to Home screen"
3. ✅ **iOS Safari**: Share → "Add to Home Screen"
4. ✅ Test emergency dial functionality
5. ✅ Verify touch interactions work

## 🔧 Update Your App

To make changes:
1. Edit files locally
2. Upload changed files to GitHub (drag & drop or git push)
3. GitHub Pages auto-updates in 5-10 minutes

## 🎯 Success Checklist

Your deployment is successful when:
- ✅ App loads at GitHub Pages URL
- ✅ All navigation works
- ✅ PWA installs on mobile/desktop
- ✅ Emergency features function
- ✅ Wellness dashboard displays
- ✅ Works offline after first load
- ✅ No console errors

## 🚨 Important Notes

### Custom Domain (Optional)
- You can use a custom domain in Settings → Pages → Custom domain
- Add CNAME file with your domain name

### HTTPS Requirement
- GitHub Pages provides HTTPS automatically
- Required for PWA features to work

### File Limits
- Repository size limit: 1GB
- Individual file limit: 100MB
- Your app is well under these limits

## 🔒 Security & Privacy

- ✅ All data stored locally (no server)
- ✅ HTTPS enabled by default
- ✅ No sensitive information exposed
- ✅ Emergency features work offline

## 📞 Emergency Contacts Update

Before going live, update emergency numbers in `crisis-support.js`:
```javascript
const emergencyContacts = [
    { name: "Emergency Services", number: "911", type: "call" },
    { name: "Crisis Hotline", number: "988", type: "call" },
    // Add your local emergency contacts
];
```

## 🎉 Share Your App

Once deployed, you can share:
```
🌐 Live App: https://YOUR-USERNAME.github.io/mindcare-pwa
📱 PWA: Installable on mobile and desktop
🚨 Crisis Support: 24/7 emergency features
📊 Wellness Tracking: Comprehensive mental health dashboard
```

---

**Your MindCare PWA is now live on GitHub Pages! 🚀**

**Next Steps:**
1. Test thoroughly on different devices
2. Share with friends/classmates for feedback
3. Consider adding more mental health resources
4. Monitor usage and gather user feedback
