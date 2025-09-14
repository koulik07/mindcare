<<<<<<< HEAD
# MindCare - Student Mental Health Support PWA

MindCare is a comprehensive Progressive Web Application designed to provide mental health support for students. It features crisis support, wellness tracking, mood monitoring, breathing exercises, and a complete PWA experience with offline capabilities.

## 🌟 Features

### Core Mental Health Features
- **Crisis Support System**: Emergency contacts, quick dial, grounding exercises, personal safety planning
- **Wellness Dashboard**: Comprehensive statistics, achievements, streaks, and progress tracking
- **Mood Tracking**: Daily mood logging with trend visualization and insights
- **Breathing Exercises**: Guided breathing sessions with various techniques
- **AI Chat Support**: 24/7 chatbot assistance with mental health resources
- **Community Forum**: Peer support and discussion platform
- **Resource Library**: Mental health articles, videos, and guides
- **Appointment Booking**: Schedule sessions with counselors

### PWA Features
- **Offline Support**: Full functionality without internet connection
- **Installation**: Install as native app on mobile and desktop
- **Push Notifications**: Emergency alerts and wellness reminders
- **Background Sync**: Data synchronization when connection is restored
- **Emergency Quick Access**: Floating emergency button on all pages

## 🚀 Quick Start

### Option 1: Local Development Server
```bash
# Navigate to project directory
cd project

# Start a local server (Python)
python -m http.server 8000

# Or using Node.js
npx serve .

# Or using PHP
php -S localhost:8000
```

### Option 2: Static Hosting Deployment

#### GitHub Pages
1. Create a new repository on GitHub
2. Upload all project files to the repository
3. Go to Settings → Pages
4. Select source branch (usually `main`)
5. Your app will be available at `https://username.github.io/repository-name`

#### Netlify
1. Visit [netlify.com](https://netlify.com)
2. Drag and drop the project folder
3. Your app will be deployed instantly with a custom URL

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

## 📱 PWA Installation Testing

### Desktop Installation
1. Open the app in Chrome, Edge, or Firefox
2. Look for the install prompt or click the install icon in the address bar
3. Click "Install" to add MindCare to your desktop
4. Test offline functionality by disconnecting internet

### Mobile Installation (Android)
1. Open the app in Chrome mobile browser
2. Tap the menu (three dots) → "Add to Home screen"
3. Confirm installation
4. Test the app from the home screen icon

### Mobile Installation (iOS)
1. Open the app in Safari
2. Tap the Share button → "Add to Home Screen"
3. Confirm installation
4. Test the app from the home screen icon

## 🧪 Testing Checklist

### Authentication & Navigation
- [ ] User registration with username/email/password
- [ ] User login with valid credentials
- [ ] Navigation between all pages works correctly
- [ ] Theme toggle (light/dark mode) functions properly
- [ ] Responsive design on mobile, tablet, and desktop

### Crisis Support Features
- [ ] Emergency contacts display correctly
- [ ] Quick dial buttons initiate calls/texts
- [ ] Grounding exercise modal functions properly
- [ ] Personal safety plan saves and loads correctly
- [ ] Emergency button appears on all pages
- [ ] Long press emergency button calls 988

### Wellness Dashboard
- [ ] Wellness score calculates and displays
- [ ] Quick stats update correctly
- [ ] Achievements unlock and display properly
- [ ] Mood chart renders with sample data
- [ ] Quick mood logging works
- [ ] Data export downloads CSV file
- [ ] Streaks and goals display correctly

### PWA Functionality
- [ ] Service worker registers successfully
- [ ] App works offline after initial load
- [ ] Install prompt appears on supported browsers
- [ ] App installs as standalone application
- [ ] Push notifications work (if permissions granted)
- [ ] Background sync functions when connection restored

### Other Features
- [ ] Breathing exercises play correctly
- [ ] Chat bot responds to messages
- [ ] Forum posts can be created and viewed
- [ ] Resources filter and display properly
- [ ] Appointment booking saves appointments
- [ ] Profile settings save correctly

## 🔧 Configuration

### Customizing Emergency Contacts
Edit `crisis-support.js` to modify emergency contact numbers:
```javascript
const emergencyContacts = [
    { name: "Emergency Services", number: "911", type: "call" },
    { name: "Crisis Hotline", number: "988", type: "call" },
    // Add your local emergency contacts here
];
```

### Modifying PWA Settings
Edit `manifest.json` to customize app metadata:
```json
{
    "name": "Your App Name",
    "short_name": "YourApp",
    "theme_color": "#667eea",
    "background_color": "#ffffff"
}
```

### Adding Custom Resources
Edit `resources.js` to add mental health resources:
```javascript
const resources = [
    {
        title: "Your Resource Title",
        description: "Resource description",
        category: "articles",
        url: "https://example.com"
    }
];
```

## 📊 Data Storage

The app uses `localStorage` for data persistence:
- **User Authentication**: Login status and user preferences
- **Wellness Data**: Mood entries, streaks, achievements, goals
- **Crisis Support**: Safety plan, emergency usage logs
- **Settings**: Theme preferences, notification settings

### Data Export
Users can export their wellness data as CSV from the wellness dashboard.

### Data Privacy
All data is stored locally on the user's device. No data is transmitted to external servers.

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: localStorage API
- **PWA**: Service Worker, Web App Manifest
- **Charts**: HTML5 Canvas API
- **Icons**: Font Awesome
- **No Backend Required**: Fully client-side application

## 📁 File Structure

```
project/
├── index.html              # Landing page
├── login.html              # Login page
├── signup.html             # Registration page
├── dashboard.html          # Main dashboard
├── crisis-support.html     # Crisis support page
├── wellness-dashboard.html # Wellness tracking
├── breathing-exercises.html # Breathing exercises
├── chat.html              # AI chat support
├── forum.html             # Community forum
├── resources.html         # Mental health resources
├── appointments.html      # Appointment booking
├── profile.html           # User profile
├── styles.css             # Main styles
├── styles-extended.css    # Extended styles for new features
├── auth.js                # Authentication logic
├── dashboard.js           # Dashboard functionality
├── crisis-support.js      # Crisis support features
├── wellness-dashboard.js  # Wellness tracking
├── emergency-dial.js      # Emergency quick dial
├── pwa.js                 # PWA management
├── sw.js                  # Service worker
├── manifest.json          # Web app manifest
└── README.md              # This file
```

## 🚨 Emergency Features Testing

### Crisis Support Testing
1. **Emergency Contacts**: Verify all contact numbers are correct for your region
2. **Quick Dial**: Test that calls/texts initiate properly (be careful with actual emergency numbers)
3. **Grounding Exercise**: Complete the 5-4-3-2-1 exercise flow
4. **Safety Plan**: Create and save a personal safety plan

### Emergency Button Testing
1. **Visibility**: Confirm button appears on all pages
2. **Tap Function**: Test opening emergency modal
3. **Long Press**: Test quick call to crisis hotline (use caution)
4. **Offline Access**: Verify emergency features work offline

## 🔒 Security Considerations

- All data stored locally (no server transmission)
- No sensitive data in localStorage (passwords are not stored)
- HTTPS recommended for production deployment
- Content Security Policy headers recommended

## 🐛 Troubleshooting

### PWA Not Installing
- Ensure HTTPS connection (required for PWA)
- Check browser compatibility (Chrome, Edge, Firefox, Safari)
- Verify manifest.json is accessible
- Check service worker registration in DevTools

### Offline Functionality Issues
- Clear browser cache and reload
- Check service worker status in DevTools → Application → Service Workers
- Verify network requests are being cached

### Data Not Persisting
- Check localStorage availability in browser
- Ensure not in private/incognito mode
- Check browser storage quotas

## 📞 Support

For technical issues or questions about the mental health features:
- Check browser console for error messages
- Verify all files are properly uploaded/served
- Test in different browsers and devices
- Ensure proper HTTPS setup for PWA features

## 🎯 Future Enhancements

- Integration with real mental health APIs
- Advanced analytics and insights
- Peer-to-peer support features
- Integration with wearable devices
- Multi-language support
- Professional counselor portal

---

**Important**: This application is designed to supplement, not replace, professional mental health care. Users experiencing mental health crises should contact emergency services or mental health professionals immediately.
=======
# mindcare
MindCare - Student Mental Health Support PWA`
>>>>>>> 7d67e35f17f58e07195cc0c288f9c0fa6fee56b5
