import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

declare const self: ServiceWorkerGlobalScope

clientsClaim()
precacheAndRoute(self.__WB_MANIFEST)

// App shell fallback for client-side routing
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$')
registerRoute(
  ({ request, url }: { request: Request; url: URL }) => {
    if (request.mode !== 'navigate') return false
    if (url.pathname.startsWith('/_')) return false
    if (url.pathname.match(fileExtensionRegexp)) return false
    return true
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
)

// Google Fonts
registerRoute(
  ({ url }) => /^https:\/\/fonts\.(googleapis|gstatic)\.com/.test(url.href),
  new CacheFirst({
    cacheName: 'google-fonts-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }),
    ],
  })
)

// NOTE: The /api/regulations/query endpoint uses POST, which service workers
// cannot cache via the Fetch API. Offline caching for regulation queries
// requires switching the endpoint to GET with query params, or using the Cache
// API manually from the app layer. Tracked as a future optimization.
