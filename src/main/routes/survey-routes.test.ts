import request from 'supertest'
import app from '../config/app'
import { Collection } from 'mongodb'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    it('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            { image: 'http://host.com/image1.png', answer: 'Answer 1' },
            { answer: 'Answer 2' },
            { image: 'http://host.com/image3.png', answer: 'Answer 3' }
          ]
        })
        .expect(403)
    })

    it('should return 204 on add survey with valid accessToken', async () => {
      const res = await accountCollection.insertOne({
        name: 'Leandro',
        email: 'email@mail.com',
        password: '123',
        role: 'admin'
      })
      const id = res.insertedId.toHexString()
      const accessToken = sign({ id } , env.jwtSecret)
      await accountCollection.updateOne({
        _id: res.insertedId
      },{
        $set: {
          accessToken
        }
      })
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [
            { image: 'http://host.com/image1.png', answer: 'Answer 1' },
            { answer: 'Answer 2' },
            { image: 'http://host.com/image3.png', answer: 'Answer 3' }
          ]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    it('should return 403 on load survey without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })
  })
})
