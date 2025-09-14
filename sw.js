// MindCare Service Worker
const CACHE_NAME = 'mindcare-v1.2.0';
const STATIC_CACHE = 'mindcare-static-v1.2.0';
const DYNAMIC_CACHE = 'mindcare-dynamic-v1.2.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/dashboard.html',
    '/login.html',
    '/signup.html',
    '/crisis-support.html',
    '/mood-tracker.html',
    '/breathing-exercises.html',
    '/appointments.html',
    '/chat.html',
    '/resources.html',
    '/forum.html',
    '/profile.html',
    '/styles.css',
    '/styles-extended.css',
    '/auth.js',
    '/dashboard.js',
    '/crisis-support.js',
    '/mood-tracker.js',
    '/breathing-exercises.js',
    '/appointments.js',
    '/chat.js',
    '/resources.js',
    '/forum.js',
    '/profile.js',
    '/theme.js',
    '/emergency-dial.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Emergency resources that should always be available offline
const EMERGENCY_FILES = [
    '/crisis-support.html',
    '/crisis-support.js',
    '/emergency-dial.js'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        Promise.all([
            // Cache static files
            caches.open(STATIC_CACHE).then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            }),
            // Ensure emergency files are cached
            caches.open(CACHE_NAME).then(cache => {
                console.log('Service Worker: Caching emergency files');
                return cache.addAll(EMERGENCY_FILES);
            })
        ]).then(() => {
            console.log('Service Worker: Installation complete');
            // Force activation of new service worker
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Delete old caches
                    if (cacheName !== STATIC_CACHE && 
                        cacheName !== DYNAMIC_CACHE && 
                        cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activation complete');
            // Take control of all clients
            return self.clients.claim();
        })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle emergency requests with highest priority
    if (isEmergencyRequest(request)) {
        event.respondWith(handleEmergencyRequest(request));
        return;
    }
    
    // Handle API requests
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(handleApiRequest(request));
        return;
    }
    
    // Handle static files
    if (isStaticFile(request)) {
        event.respondWith(handleStaticRequest(request));
        return;
    }
    
    // Handle navigation requests
    if (request.mode === 'navigate') {
        event.respondWith(handleNavigationRequest(request));
        return;
    }
    
    // Default: network first, then cache
    event.respondWith(
        fetch(request)
            .then(response => {
                // Cache successful responses
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Fallback to cache
                return caches.match(request);
            })
    );
});

// Handle emergency requests (crisis support, emergency dial)
function handleEmergencyRequest(request) {
    return caches.match(request)
        .then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // If not in cache, try network but with short timeout
            return Promise.race([
                fetch(request),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), 3000)
                )
            ]);
        })
        .catch(() => {
            // Emergency fallback - serve basic crisis support
            if (request.url.includes('crisis-support')) {
                return caches.match('/crisis-support.html');
            }
            return new Response('Emergency services temporarily unavailable. Please call 911 or 988 directly.', {
                status: 503,
                headers: { 'Content-Type': 'text/plain' }
            });
        });
}

// Handle API requests with background sync
function handleApiRequest(request) {
    return fetch(request)
        .then(response => {
            // Cache successful API responses
            if (response.ok) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE).then(cache => {
                    cache.put(request, responseClone);
                });
            }
            return response;
        })
        .catch(() => {
            // Try to serve from cache
            return caches.match(request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    // Queue for background sync if possible
                    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
                        return queueApiRequest(request);
                    }
                    
                    throw new Error('Network unavailable');
                });
        });
}

// Handle static file requests
function handleStaticRequest(request) {
    return caches.match(request)
        .then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // Fetch and cache if not found
            return fetch(request)
                .then(response => {
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(STATIC_CACHE).then(cache => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                });
        });
}

// Handle navigation requests
function handleNavigationRequest(request) {
    return fetch(request)
        .catch(() => {
            // Serve cached page or fallback to dashboard
            return caches.match(request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    // Fallback to dashboard for navigation
                    return caches.match('/dashboard.html');
                });
        });
}

// Helper functions
function isEmergencyRequest(request) {
    const emergencyPaths = ['/crisis-support', '/emergency-dial', 'emergency'];
    return emergencyPaths.some(path => request.url.includes(path));
}

function isStaticFile(request) {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2'];
    return staticExtensions.some(ext => request.url.includes(ext));
}

function queueApiRequest(request) {
    // Store failed request for background sync
    return new Promise((resolve) => {
        const requestData = {
            url: request.url,
            method: request.method,
            headers: Object.fromEntries(request.headers.entries()),
            timestamp: Date.now()
        };
        
        // Store in IndexedDB or localStorage for sync later
        if ('indexedDB' in self) {
            storeFailedRequest(requestData);
        }
        
        resolve(new Response(JSON.stringify({
            error: 'Request queued for sync',
            queued: true
        }), {
            status: 202,
            headers: { 'Content-Type': 'application/json' }
        }));
    });
}

// Background sync for failed requests
self.addEventListener('sync', event => {
    console.log('Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(syncFailedRequests());
    }
    
    if (event.tag === 'emergency-sync') {
        event.waitUntil(syncEmergencyData());
    }
});

// Sync failed requests when back online
async function syncFailedRequests() {
    try {
        const failedRequests = await getFailedRequests();
        
        for (const requestData of failedRequests) {
            try {
                await fetch(requestData.url, {
                    method: requestData.method,
                    headers: requestData.headers
                });
                
                // Remove from queue on success
                await removeFailedRequest(requestData);
                
            } catch (error) {
                console.log('Failed to sync request:', error);
            }
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Sync emergency data and logs
async function syncEmergencyData() {
    try {
        // Sync emergency logs
        const emergencyLogs = localStorage.getItem('emergencyLog');
        if (emergencyLogs) {
            await fetch('/api/emergency-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: emergencyLogs
            });
        }
        
        // Sync safety plan updates
        const safetyPlan = localStorage.getItem('personalSafetyPlan');
        if (safetyPlan) {
            await fetch('/api/safety-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: safetyPlan
            });
        }
        
    } catch (error) {
        console.error('Emergency data sync failed:', error);
    }
}

// Push notifications for emergency alerts
self.addEventListener('push', event => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: 'MindCare emergency support is available',
        icon: '/assets/icon-192x192.png',
        badge: '/assets/badge-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'emergency-notification',
        requireInteraction: true,
        actions: [
            {
                action: 'crisis-support',
                title: 'Crisis Support',
                icon: '/assets/crisis-icon.png'
            },
            {
                action: 'call-988',
                title: 'Call 988',
                icon: '/assets/phone-icon.png'
            }
        ]
    };
    
    if (event.data) {
        const data = event.data.json();
        options.body = data.body || options.body;
        options.title = data.title || 'MindCare Alert';
    }
    
    event.waitUntil(
        self.registration.showNotification('MindCare Alert', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked', event.action);
    
    event.notification.close();
    
    let targetUrl = '/dashboard.html';
    
    switch (event.action) {
        case 'crisis-support':
            targetUrl = '/crisis-support.html';
            break;
        case 'call-988':
            // Open crisis support and trigger call
            targetUrl = '/crisis-support.html?call=988';
            break;
        default:
            targetUrl = '/dashboard.html';
    }
    
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            // Focus existing window if available
            for (const client of clientList) {
                if (client.url.includes('mindcare') && 'focus' in client) {
                    client.navigate(targetUrl);
                    return client.focus();
                }
            }
            
            // Open new window
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});

// IndexedDB helpers for storing failed requests
function storeFailedRequest(requestData) {
    // Implementation would use IndexedDB to store failed requests
    console.log('Storing failed request for sync:', requestData);
}

function getFailedRequests() {
    // Implementation would retrieve failed requests from IndexedDB
    return Promise.resolve([]);
}

function removeFailedRequest(requestData) {
    // Implementation would remove synced request from IndexedDB
    return Promise.resolve();
}

// Message handling for communication with main thread
self.addEventListener('message', event => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'EMERGENCY_CACHE') {
        // Pre-cache emergency resources
        event.waitUntil(
            caches.open(CACHE_NAME).then(cache => {
                return cache.addAll(EMERGENCY_FILES);
            })
        );
    }
});
