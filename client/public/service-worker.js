// Service Worker for NEET Master PWA
const CACHE_NAME = 'neet-master-v1';
const API_CACHE_NAME = 'neet-master-api-v1';
const IMAGE_CACHE_NAME = 'neet-master-images-v1';

// Assets to cache immediately during install
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/maskable_icon.png'
];

// Cache configuration
const CACHE_CONFIG = {
  staticAssets: {
    cacheName: CACHE_NAME,
    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    maxEntries: 60
  },
  images: {
    cacheName: IMAGE_CACHE_NAME,
    maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
    maxEntries: 100
  },
  api: {
    cacheName: API_CACHE_NAME,
    maxAgeSeconds: 60 * 60, // 1 hour
    maxEntries: 50
  }
};

// Install event - cache critical static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Precaching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Check if this cache name isn't in our allowlist
          if (![CACHE_NAME, API_CACHE_NAME, IMAGE_CACHE_NAME].includes(cacheName)) {
            console.log('Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Claim clients immediately
      return self.clients.claim();
    })
  );
});

// Helper function to determine cache config based on request URL
function getCacheConfig(request) {
  const url = new URL(request.url);
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    return CACHE_CONFIG.api;
  }
  
  // Handle image requests
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|avif)$/)) {
    return CACHE_CONFIG.images;
  }
  
  // Handle static asset requests
  if (
    url.pathname.match(/\.(js|css|ico|woff|woff2|ttf|eot)$/) ||
    STATIC_CACHE_URLS.includes(url.pathname)
  ) {
    return CACHE_CONFIG.staticAssets;
  }
  
  // Default to static assets config
  return CACHE_CONFIG.staticAssets;
}

// Cache expiration check
function isExpired(cachedResponse, maxAgeSeconds) {
  if (!cachedResponse || !cachedResponse.headers || !cachedResponse.headers.get('date')) {
    return true;
  }
  
  const dateHeader = cachedResponse.headers.get('date');
  const parsedDate = new Date(dateHeader).getTime();
  const expirationTime = parsedDate + (maxAgeSeconds * 1000);
  
  return Date.now() > expirationTime;
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, config) {
  const cache = await caches.open(config.cacheName);
  const cachedResponse = await cache.match(request);
  
  // Return cached response immediately if not expired
  if (cachedResponse && !isExpired(cachedResponse, config.maxAgeSeconds)) {
    return cachedResponse;
  }
  
  // Clone the request for the cache
  const fetchPromise = fetch(request).then(async (response) => {
    // Don't cache non-successful responses
    if (response.ok) {
      const clonedResponse = response.clone();
      await cache.put(request, clonedResponse);
    }
    return response;
  });
  
  // Return cached response if available (even if stale), otherwise wait for network
  return cachedResponse || fetchPromise;
}

// Network-first strategy
async function networkFirst(request, config) {
  const cache = await caches.open(config.cacheName);
  
  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Fall back to cache if network fails
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If nothing in cache either, throw the original error
    throw error;
  }
}

// Cache-first strategy
async function cacheFirst(request, config) {
  const cache = await caches.open(config.cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse && !isExpired(cachedResponse, config.maxAgeSeconds)) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return stale response if network fails
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Fetch event - handle caching strategies
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle only GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  const url = new URL(event.request.url);
  const config = getCacheConfig(event.request);
  
  // Choose the appropriate strategy based on the request type
  if (url.pathname.startsWith('/api/')) {
    // Network-first for API requests
    event.respondWith(networkFirst(event.request, config));
  } else if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|avif)$/)) {
    // Cache-first for images
    event.respondWith(cacheFirst(event.request, config));
  } else if (STATIC_CACHE_URLS.includes(url.pathname) || url.pathname === '/') {
    // Cache-first for critical static assets
    event.respondWith(cacheFirst(event.request, config));
  } else {
    // Stale-while-revalidate for other assets
    event.respondWith(staleWhileRevalidate(event.request, config));
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-quiz-results') {
    event.waitUntil(syncOfflineData());
  }
});

// Function to sync offline data
async function syncOfflineData() {
  try {
    const pendingQuizResults = await getPendingQuizResults();
    
    for (const result of pendingQuizResults) {
      await fetch('/api/quiz-attempts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });
      
      // If successful, remove from IndexedDB
      await removePendingQuizResult(result.id);
    }
  } catch (error) {
    console.error('Failed to sync offline data:', error);
  }
}

// IndexedDB functions for offline data - to be implemented with actual IndexedDB
async function getPendingQuizResults() {
  return [];
}

async function removePendingQuizResult(id) {
  // IndexedDB implementation
} 