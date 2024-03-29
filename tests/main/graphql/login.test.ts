import { MongoHelper } from '@infra/db/mongodb/mongo-helper'
import { setupApp } from '@main/config/app'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { Express } from 'express'
import request from 'supertest'

describe('Login GraphQL', () => {
  let accountCollection: Collection
  let app: Express

  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
    accountCollection = MongoHelper.getCollection('accounts')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await accountCollection.deleteMany({})
  })

  describe('Login Query', () => {
    const query = `query {
      login (email: "leandro@mail.com", password: "123") {
        accessToken
        name
      }
    }`

    it('should return an Account on valid credentials', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Leandro',
        email: 'leandro@mail.com',
        password
      })
      const res = await request(app)
        .post('/graphql')
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.login.accessToken).toBeTruthy()
      expect(res.body.data.login.name).toBe('Leandro')
    })

    it('should return UnauthorizedError on invalid credentials', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })

      expect(res.status).toBe(401)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Unauthorized')
    })
  })

  describe('SignUp Mutation', () => {
    const query = `mutation{
      signUp(name: "Leandro", email: "leandro@mail.com", password: "123", passwordConfirmation: "123"){
        accessToken
        name
      }
    }`

    it('should return an Account on valid data', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.signUp.accessToken).toBeTruthy()
      expect(res.body.data.signUp.name).toBe('Leandro')
    })

    it('should return EmailInUseError if email is already in use', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Leandro',
        email: 'leandro@mail.com',
        password
      })
      const res = await request(app)
        .post('/graphql')
        .send({ query })

      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('The received email is already in use')
    })
  })
})
