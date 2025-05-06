// Service Worker for AIRAssist PWA - iOS Safari Compatible Version
const CACHE_NAME = 'airassist-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/maskable-icon.png',
  './iOS_BLUETOOTH_GUIDE.md'
];

// Install event - cache assets with iOS Safari compatibility
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        // Cache assets individually to handle iOS Safari limitations
        return Promise.all(
          ASSETS_TO_CACHE.map(url => {
            // Fetch with no-cors for cross-origin resources
            return fetch(url, { credentials: 'same-origin' })
              .then(response => {
                // Only cache successful responses
                if (response.ok) {
                  return cache.put(url, response);
                }
              })
              .catch(error => {
                console.error('Failed to cache asset:', url, error);
              });
          })
        );
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fall back to network with iOS Safari compatibility
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Handle API calls differently
  const url = new URL(event.request.url);
  if (url.pathname.includes('webhook')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the response from cache
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        // Make network request
        return fetch(fetchRequest)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200) {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the fetched response
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Use request URL as the key for better iOS compatibility
                cache.put(event.request.url, responseToCache);
              })
              .catch(err => {
                console.error('Cache put error:', err);
              });
            
            return response;
          })
          .catch((error) => {
            console.error('Fetch error:', error);
            // Fallback for offline experience
            if (event.request.url.includes('.html') || event.request.url.endsWith('/')) {
              return caches.match('./index.html');
            }
            
            // Return a specific error response for uncached resources
            return new Response('Network error occurred', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
      .catch((error) => {
        console.error('Cache match error:', error);
        // Fallback for offline experience
        if (event.request.url.includes('.html') || event.request.url.endsWith('/')) {
          return caches.match('./index.html');
        }
      })
  );
});

// Background Sync for offline requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncOfflineMessages());
  }
});

// Function to sync offline messages
async function syncOfflineMessages() {
  try {
    // Open IndexedDB
    const db = await openDatabase();
    const tx = db.transaction('offline-messages', 'readonly');
    const store = tx.objectStore('offline-messages');
    
    // Get all offline messages
    const messages = await store.getAll();
    
    // Process each message
    for (const message of messages) {
      try {
        // Convert base64 to blob
        const byteString = atob(message.audio.split(',')[1]);
        const mimeString = message.audio.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([ab], { type: mimeString });
        
        // Create FormData
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');
        formData.append('offlineTimestamp', message.timestamp);
        formData.append('voice', message.voice || 'default');
        
        // Send to n8n
        const response = await fetch(message.url, {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          // Remove message from IndexedDB
          const deleteTx = db.transaction('offline-messages', 'readwrite');
          const deleteStore = deleteTx.objectStore('offline-messages');
          await deleteStore.delete(message.id);
        }
      } catch (error) {
        console.error('Error syncing message:', error);
      }
    }
    
    // Close database
    db.close();
  } catch (error) {
    console.error('Error syncing offline messages:', error);
  }
}

// Open IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('airassist-db', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('offline-messages')) {
        db.createObjectStore('offline-messages', { keyPath: 'id' });
      }
    };
  });
}

// Handle push notifications
self.addEventListener('push', (event) => {
  let notificationData = {};
  
  try {
    notificationData = event.data.json();
  } catch (e) {
    notificationData = {
      title: 'New Message',
      body: 'You have a new message from Alli.'
    };
  }
  
  const options = {
    body: notificationData.body || 'You have a new message from Alli.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-icon.png',
    vibrate: [100, 50, 100],
    data: {
      url: notificationData.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title || 'AIRAssist', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // If a window client is already open, focus it
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});
