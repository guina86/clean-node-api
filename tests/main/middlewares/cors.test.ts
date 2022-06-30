import { setupApp } from '@main/config/app'
import { Express } from 'express'
import request from 'supertest'

describe('CORS Middleware', () => {
  let app: Express

  beforeAll(async () => {
    app = await setupApp()
  })

  it('should enable CORS', async () => {
    app.get('/test_cors', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*')
  })
})
