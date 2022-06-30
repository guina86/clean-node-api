import { setupApp } from '@main/config/app'
import { Express } from 'express'
import request from 'supertest'

describe('Content Type Middleware', () => {
  let app: Express

  beforeAll(async () => {
    app = await setupApp()
  })

  it('should return default content type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })

  it('should return xml when forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send()
    })
    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
