import request from 'supertest'
import { setupApp } from '../../../src/main/config/app'
import { MongoHelper } from '../../../src/infra/db/mongodb'
import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import { Express } from 'express'

let accountCollection: Collection
let app: Express

describe('Login Routes', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    it('should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Leandro',
          email: 'email@mail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    it('should return 200 on login', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Leandro',
        email: 'email@mail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'email@mail.com',
          password: '123'
        })
        .expect(200)
    })

    it('should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'email@mail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
