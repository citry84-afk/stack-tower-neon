/**
 * 🚀 STACK TOWER NEON - SERVICE WORKER
 * PWA Optimization & Offline Functionality
 */

const CACHE_NAME = 'stack-tower-neon-v1.2.0';
const CACHE_VERSION = '1.2.0';

// Essential files to cache for offline play
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/analytics.js',
    '/js/ads-manager.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/phaser/3.88.2/phaser.min.js'
];

// Dynamic cache for analytics and ads (shorter TTL)
const DYNAMIC_CACHE_NAME = 'stack-tower-neon-dynamic-v1.0.0';
const ANALYTICS_CACHE_NAME = 'stack-tower-neon-analytics-v1.0.0';

// Cache strategies
const CACHE_STRATEGIES = {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Install event - cache essential resources
self.addEventListener('install', (event) => {
    console.log('🚀 Service Worker installing...', CACHE_VERSION);
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Caching essential resources');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('✅ Essential resources cached');
                return self.skipWaiting(); // Activate immediately
            })
            .catch((error) => {
                console.error('❌ Cache installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker activating...', CACHE_VERSION);
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Delete old cache versions
                        if (cacheName !== CACHE_NAME && 
                            cacheName !== DYNAMIC_CACHE_NAME && 
                            cacheName !== ANALYTICS_CACHE_NAME) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activated');
                return self.clients.claim(); // Take control immediately
            })
    );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Only handle GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests with appropriate strategies
    if (isAnalyticsRequest(url)) {
        event.respondWith(handleAnalyticsRequest(request));
    } else if (isAdRequest(url)) {
        event.respondWith(handleAdRequest(request));
    } else if (isStaticResource(url)) {
        event.respondWith(handleStaticResource(request));
    } else if (isGameAsset(url)) {
        event.respondWith(handleGameAsset(request));
    } else {
        event.respondWith(handleGenericRequest(request));
    }
});

// Analytics requests - network first with offline fallback
function handleAnalyticsRequest(request) {
    return caches.open(ANALYTICS_CACHE_NAME)
        .then((cache) => {
            return fetch(request)
                .then((networkResponse) => {
                    // Cache successful analytics responses briefly
                    if (networkResponse.ok) {
                        cache.put(request, networkResponse.clone());
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Offline - return cached version or create offline response
                    return cache.match(request) || createOfflineAnalyticsResponse();
                });
        });
}

// Ad requests - always try network first, no offline fallback
function handleAdRequest(request) {
    return fetch(request)
        .then((response) => {
            // Don't cache ad responses for privacy/revenue reasons
            return response;
        })
        .catch(() => {
            // Return a blank response for offline ad requests
            return new Response('', { 
                status: 204,
                statusText: 'No Content - Offline'
            });
        });
}

// Static resources - cache first with network fallback
function handleStaticResource(request) {
    return caches.match(request)
        .then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // Not in cache, fetch from network
            return fetch(request)
                .then((networkResponse) => {
                    // Cache successful responses
                    if (networkResponse.ok) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => cache.put(request, responseClone));
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Offline and not cached - return offline page
                    if (request.destination === 'document') {
                        return createOfflineGameResponse();
                    }
                    throw new Error('Resource not available offline');
                });
        });
}

// Game assets - stale while revalidate
function handleGameAsset(request) {
    return caches.open(DYNAMIC_CACHE_NAME)
        .then((cache) => {
            return cache.match(request)
                .then((cachedResponse) => {
                    // Fetch in background to update cache
                    const fetchPromise = fetch(request)
                        .then((networkResponse) => {
                            if (networkResponse.ok) {
                                cache.put(request, networkResponse.clone());
                            }
                            return networkResponse;
                        })
                        .catch(() => cachedResponse);
                    
                    // Return cached version immediately if available
                    return cachedResponse || fetchPromise;
                });
        });
}

// Generic requests - network first
function handleGenericRequest(request) {
    return fetch(request)
        .catch(() => {
            // Check if we have it cached
            return caches.match(request);
        });
}

// Helper functions to identify request types
function isAnalyticsRequest(url) {
    return url.hostname.includes('google-analytics.com') ||
           url.hostname.includes('googletagmanager.com') ||
           url.pathname.includes('analytics') ||
           url.pathname.includes('gtag');
}

function isAdRequest(url) {
    return url.hostname.includes('googlesyndication.com') ||
           url.hostname.includes('doubleclick.net') ||
           url.hostname.includes('adsystem.com') ||
           url.pathname.includes('/ads/') ||
           url.pathname.includes('adnxs.com');
}

function isStaticResource(url) {
    return STATIC_CACHE_URLS.some(staticUrl => {
        return url.pathname === staticUrl || url.href === staticUrl;
    });
}

function isGameAsset(url) {
    return url.pathname.includes('/assets/') ||
           url.pathname.includes('/images/') ||
           url.pathname.includes('/sounds/') ||
           url.pathname.endsWith('.png') ||
           url.pathname.endsWith('.jpg') ||
           url.pathname.endsWith('.svg') ||
           url.pathname.endsWith('.mp3') ||
           url.pathname.endsWith('.wav');
}

// Offline response creators
function createOfflineGameResponse() {
    const offlineHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Stack Tower Neon - Offline</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: 'Orbitron', monospace;
                    background: linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #1a0a1a 100%);
                    color: #00FFFF;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    text-align: center;
                }
                .offline-container {
                    max-width: 400px;
                    padding: 40px;
                    border: 2px solid #00FFFF;
                    border-radius: 15px;
                    background: rgba(0, 0, 0, 0.8);
                    box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
                }
                .title {
                    font-size: 2rem;
                    font-weight: 900;
                    color: #FF0080;
                    text-shadow: 0 0 20px #FF0080;
                    margin-bottom: 20px;
                }
                .message {
                    font-size: 1.2rem;
                    margin-bottom: 30px;
                    line-height: 1.5;
                }
                .retry-btn {
                    background: transparent;
                    border: 2px solid #00FFFF;
                    color: #00FFFF;
                    padding: 15px 30px;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }
                .retry-btn:hover {
                    background: rgba(0, 255, 255, 0.1);
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
                }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <div class="title">STACK TOWER NEON</div>
                <div class="message">
                    🌐 Sin conexión a Internet<br>
                    El juego necesita conexión para cargar anuncios y analytics.
                </div>
                <button class="retry-btn" onclick="window.location.reload()">
                    🔄 REINTENTAR
                </button>
            </div>
            <script>
                // Auto-retry when connection is restored
                window.addEventListener('online', () => {
                    window.location.reload();
                });
            </script>
        </body>
        </html>
    `;
    
    return new Response(offlineHTML, {
        headers: { 'Content-Type': 'text/html' }
    });
}

function createOfflineAnalyticsResponse() {
    // Return empty response for analytics when offline
    return new Response('', {
        status: 200,
        statusText: 'OK - Offline Mode'
    });
}

// Push notification handling
self.addEventListener('push', (event) => {
    console.log('📢 Push notification received');
    
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body || '¡Vuelve a jugar Stack Tower Neon!',
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/badge-72x72.png',
        image: data.image,
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/',
            timestamp: Date.now()
        },
        actions: [
            {
                action: 'play',
                title: '🎮 Jugar Ahora',
                icon: '/assets/icons/play-icon.png'
            },
            {
                action: 'dismiss',
                title: '❌ Cerrar',
                icon: '/assets/icons/close-icon.png'
            }
        ],
        requireInteraction: true,
        tag: 'stack-tower-neon'
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'Stack Tower Neon', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('📢 Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'play') {
        // Open game directly
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/?source=notification')
        );
    } else if (event.action === 'dismiss') {
        // Just close, do nothing
        return;
    } else {
        // Default click - open game
        event.waitUntil(
            clients.openWindow('/?source=notification')
        );
    }
});

// Background sync for offline analytics
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'analytics-sync') {
        event.waitUntil(syncOfflineAnalytics());
    }
});

async function syncOfflineAnalytics() {
    try {
        // Retrieve offline analytics data
        const offlineData = await getOfflineAnalyticsData();
        
        if (offlineData.length > 0) {
            // Send to analytics
            await sendAnalyticsData(offlineData);
            
            // Clear offline storage
            await clearOfflineAnalyticsData();
            
            console.log('📊 Offline analytics synced successfully');
        }
    } catch (error) {
        console.error('❌ Failed to sync offline analytics:', error);
    }
}

async function getOfflineAnalyticsData() {
    // In a real implementation, retrieve from IndexedDB
    return [];
}

async function sendAnalyticsData(data) {
    // Send to Google Analytics or custom endpoint
    for (const event of data) {
        try {
            await fetch('/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event)
            });
        } catch (error) {
            console.error('Failed to send analytics event:', error);
        }
    }
}

async function clearOfflineAnalyticsData() {
    // Clear IndexedDB storage
}

// Cache management
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_STATS') {
        getCacheStats().then(stats => {
            event.ports[0].postMessage(stats);
        });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        clearOldCaches().then(() => {
            event.ports[0].postMessage({ success: true });
        });
    }
});

async function getCacheStats() {
    const cacheNames = await caches.keys();
    const stats = {};
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        stats[cacheName] = keys.length;
    }
    
    return stats;
}

async function clearOldCaches() {
    const cacheNames = await caches.keys();
    const deletionPromises = cacheNames
        .filter(cacheName => cacheName !== CACHE_NAME)
        .map(cacheName => caches.delete(cacheName));
    
    await Promise.all(deletionPromises);
}

// Periodic cache cleanup (every 24 hours)
setInterval(() => {
    console.log('🧹 Performing periodic cache cleanup');
    clearOldCaches();
}, 24 * 60 * 60 * 1000);

console.log('🚀 Service Worker loaded successfully - Version:', CACHE_VERSION);
