// PWA Management Script
let deferredPrompt;
let isOnline = navigator.onLine;

document.addEventListener('DOMContentLoaded', function() {
    initializePWA();
    setupOfflineDetection();
    setupInstallPrompt();
});

function initializePWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        registerServiceWorker();
    }
    
    // Setup notification permissions
    setupNotifications();
    
    // Add PWA meta tags if not present
    addPWAMetaTags();
    
    // Check if running as PWA
    checkPWAMode();
}

async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
        });
        
        console.log('PWA: Service Worker registered successfully');
        
        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    showUpdateAvailable(registration);
                }
            });
        });
        
        // Pre-cache emergency resources
        if (registration.active) {
            registration.active.postMessage({
                type: 'EMERGENCY_CACHE'
            });
        }
        
    } catch (error) {
        console.error('PWA: Service Worker registration failed:', error);
    }
}

function setupNotifications() {
    if ('Notification' in window) {
        // Request notification permission for emergency alerts
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                console.log('PWA: Notification permission:', permission);
                
                if (permission === 'granted') {
                    showWelcomeNotification();
                }
            });
        }
    }
}

function addPWAMetaTags() {
    const head = document.head;
    
    // Add manifest link if not present
    if (!document.querySelector('link[rel="manifest"]')) {
        const manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        manifestLink.href = '/manifest.json';
        head.appendChild(manifestLink);
    }
    
    // Add theme color if not present
    if (!document.querySelector('meta[name="theme-color"]')) {
        const themeColor = document.createElement('meta');
        themeColor.name = 'theme-color';
        themeColor.content = '#667eea';
        head.appendChild(themeColor);
    }
    
    // Add apple touch icon
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
        const appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        appleIcon.href = '/assets/icon-192x192.png';
        head.appendChild(appleIcon);
    }
    
    // Add iOS meta tags
    const iosMetas = [
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'MindCare' }
    ];
    
    iosMetas.forEach(meta => {
        if (!document.querySelector(`meta[name="${meta.name}"]`)) {
            const metaTag = document.createElement('meta');
            metaTag.name = meta.name;
            metaTag.content = meta.content;
            head.appendChild(metaTag);
        }
    });
}

function checkPWAMode() {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  window.navigator.standalone ||
                  document.referrer.includes('android-app://');
    
    if (isPWA) {
        document.body.classList.add('pwa-mode');
        console.log('PWA: Running in standalone mode');
        
        // Hide browser UI elements if running as PWA
        hideBrowserElements();
    }
}

function setupOfflineDetection() {
    // Online/offline status
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Update UI based on current status
    updateConnectionStatus();
}

function handleOnline() {
    isOnline = true;
    console.log('PWA: Back online');
    updateConnectionStatus();
    
    // Trigger background sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then(registration => {
            return registration.sync.register('background-sync');
        });
    }
    
    showConnectionAlert('Back online! Syncing data...', 'success');
}

function handleOffline() {
    isOnline = false;
    console.log('PWA: Gone offline');
    updateConnectionStatus();
    
    showConnectionAlert('You\'re offline. Emergency features still available.', 'warning');
}

function updateConnectionStatus() {
    // Add/remove offline class from body
    document.body.classList.toggle('offline', !isOnline);
    
    // Update connection indicator if present
    const indicator = document.querySelector('.connection-indicator');
    if (indicator) {
        indicator.textContent = isOnline ? 'Online' : 'Offline';
        indicator.className = `connection-indicator ${isOnline ? 'online' : 'offline'}`;
    }
}

function setupInstallPrompt() {
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('PWA: Install prompt available');
        
        // Prevent default mini-infobar
        e.preventDefault();
        
        // Store the event for later use
        deferredPrompt = e;
        
        // Show custom install button
        showInstallButton();
    });
    
    // Listen for app installed
    window.addEventListener('appinstalled', (e) => {
        console.log('PWA: App installed successfully');
        hideInstallButton();
        
        // Track installation
        trackPWAInstall();
        
        showInstallSuccessMessage();
    });
}

function showInstallButton() {
    // Create install button if not exists
    let installBtn = document.getElementById('pwa-install-btn');
    
    if (!installBtn) {
        installBtn = document.createElement('button');
        installBtn.id = 'pwa-install-btn';
        installBtn.className = 'pwa-install-btn';
        installBtn.innerHTML = `
            <i class="fas fa-download"></i>
            <span>Install MindCare App</span>
        `;
        
        // Add to page (could be in header, footer, or floating)
        document.body.appendChild(installBtn);
    }
    
    installBtn.style.display = 'flex';
    installBtn.addEventListener('click', promptInstall);
}

function hideInstallButton() {
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
        installBtn.style.display = 'none';
    }
}

async function promptInstall() {
    if (!deferredPrompt) {
        return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log('PWA: Install prompt outcome:', outcome);
    
    if (outcome === 'accepted') {
        console.log('PWA: User accepted install');
    } else {
        console.log('PWA: User dismissed install');
    }
    
    // Clear the deferred prompt
    deferredPrompt = null;
    hideInstallButton();
}

function showUpdateAvailable(registration) {
    // Create update notification
    const updateNotification = document.createElement('div');
    updateNotification.className = 'pwa-update-notification';
    updateNotification.innerHTML = `
        <div class="update-content">
            <i class="fas fa-sync-alt"></i>
            <span>New version available!</span>
            <button id="update-btn" class="btn-primary">Update</button>
            <button id="dismiss-update" class="btn-secondary">Later</button>
        </div>
    `;
    
    document.body.appendChild(updateNotification);
    
    // Handle update button
    document.getElementById('update-btn').addEventListener('click', () => {
        updateApp(registration);
        updateNotification.remove();
    });
    
    // Handle dismiss button
    document.getElementById('dismiss-update').addEventListener('click', () => {
        updateNotification.remove();
    });
}

function updateApp(registration) {
    if (registration.waiting) {
        // Tell the waiting service worker to skip waiting
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Reload the page to use new service worker
        window.location.reload();
    }
}

function showWelcomeNotification() {
    if (Notification.permission === 'granted') {
        new Notification('Welcome to MindCare!', {
            body: 'Your mental health support is now available offline.',
            icon: '/assets/icon-192x192.png',
            badge: '/assets/badge-72x72.png',
            tag: 'welcome-notification'
        });
    }
}

function showConnectionAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `connection-alert connection-alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${getConnectionIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 3000);
}

function getConnectionIcon(type) {
    switch (type) {
        case 'success': return 'wifi';
        case 'warning': return 'exclamation-triangle';
        case 'error': return 'times-circle';
        default: return 'info-circle';
    }
}

function showInstallSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'install-success-message';
    message.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>MindCare Installed!</h3>
            <p>You can now access MindCare from your home screen, even when offline.</p>
            <button onclick="this.parentElement.parentElement.remove()" class="btn-primary">Got it!</button>
        </div>
    `;
    
    document.body.appendChild(message);
}

function trackPWAInstall() {
    // Track PWA installation
    const installData = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform
    };
    
    localStorage.setItem('pwaInstalled', JSON.stringify(installData));
    
    // Could send to analytics if available
    console.log('PWA: Installation tracked', installData);
}

function hideBrowserElements() {
    // Hide elements that are not needed in PWA mode
    const elementsToHide = document.querySelectorAll('.browser-only');
    elementsToHide.forEach(el => el.style.display = 'none');
}

// Emergency PWA functions
function enableEmergencyMode() {
    // Pre-cache all emergency resources
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.active.postMessage({
                type: 'EMERGENCY_CACHE'
            });
        });
    }
    
    // Request persistent storage for emergency data
    if ('storage' in navigator && 'persist' in navigator.storage) {
        navigator.storage.persist().then(persistent => {
            console.log('PWA: Persistent storage:', persistent);
        });
    }
}

// Check storage usage
async function checkStorageUsage() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
            const estimate = await navigator.storage.estimate();
            const usedMB = (estimate.usage / 1024 / 1024).toFixed(2);
            const quotaMB = (estimate.quota / 1024 / 1024).toFixed(2);
            
            console.log(`PWA: Storage used: ${usedMB}MB of ${quotaMB}MB`);
            
            // Warn if storage is getting full
            if (estimate.usage / estimate.quota > 0.8) {
                showStorageWarning();
            }
            
            return { used: usedMB, quota: quotaMB, percentage: (estimate.usage / estimate.quota * 100).toFixed(1) };
        } catch (error) {
            console.error('PWA: Storage estimate failed:', error);
        }
    }
}

function showStorageWarning() {
    const warning = document.createElement('div');
    warning.className = 'storage-warning';
    warning.innerHTML = `
        <div class="warning-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>Storage space is running low. Some offline features may be limited.</span>
            <button onclick="this.parentElement.parentElement.remove()" class="btn-secondary">OK</button>
        </div>
    `;
    
    document.body.appendChild(warning);
}

// Export PWA functions
window.pwa = {
    install: promptInstall,
    checkStorage: checkStorageUsage,
    enableEmergencyMode: enableEmergencyMode,
    isOnline: () => isOnline,
    isPWA: () => document.body.classList.contains('pwa-mode')
};
