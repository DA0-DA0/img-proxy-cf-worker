import { createCors } from 'itty-cors'
import { Router } from 'itty-router'

// Create CORS handlers.
const { preflight, corsify } = createCors({
  methods: ['GET', 'POST'],
  origins: ['*'],
  maxAge: 3600,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
})

const router = Router()

// Handle CORS preflight.
router.all('*', preflight)

router.get('/', async (request) => {
  let url
  try {
    url =
      typeof request.query.url === 'string'
        ? new URL(request.query.url)
        : undefined
    if (!url) {
      return new Response('No URL provided', { status: 400 })
    }
  } catch (err) {
    return new Response('Invalid URL', { status: 400 })
  }

  return fetch(url)
})

export default {
  async fetch(request: Request) {
    return router.handle(request).then(corsify)
  },
}
