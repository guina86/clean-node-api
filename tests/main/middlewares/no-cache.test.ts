import request from 'supertest'
import app from '../../../src/main/config/app'
import { noCache } from '../../../src/main/middlewares'

describe('NoCache Middleware', () => {
  it('should disable cache', async () => {
    app.get('/test_no_cache', noCache, (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test_no_cache')
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('Surrogate-control', 'no-store')
  })
})
