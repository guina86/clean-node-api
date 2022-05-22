import request from 'supertest'
import app from '../config/app'
import env from '../config/env'
import { mockSurveyParams } from '../../domain/test'
import { MongoHelper } from '../../infra/db/mongodb'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (role?: string): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Leandro',
    email: 'email@mail.com',
    password: '123',
    role
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
  return accessToken
}

describe('Survey Result Routes', () => {
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

  describe('PUT /surveys/:surveyId/results', () => {
    it('should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({ answer: 'any_answer' })
        .expect(403)
    })

    it('should return 200 on save survey result with accessToken', async () => {
      const accessToken = await makeAccessToken()
      const res = await surveyCollection.insertOne(mockSurveyParams())
      const surveyId = res.insertedId.toHexString()
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({ answer: 'answer A' })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    it('should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })
  })
})
