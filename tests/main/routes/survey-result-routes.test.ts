import request from 'supertest'
import { setupApp } from '../../../src/main/config/app'
import { mockSurveyParams } from '../../domain/mocks'
import { MongoHelper } from '../../../src/infra/db/mongodb'
import { Collection } from 'mongodb'
import { Express } from 'express'
import { mockAccessToken } from '../mocks'

let surveyCollection: Collection
let accountCollection: Collection
let app: Express

const makeAccessToken = async (role?: string): Promise<string> => mockAccessToken(surveyCollection, accountCollection, role)

describe('Survey Result Routes', () => {
  beforeAll(async () => {
    app = await setupApp()
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

    it('should return 200 on load survey result with accessToken', async () => {
      const accessToken = await makeAccessToken()
      const res = await surveyCollection.insertOne(mockSurveyParams())
      const surveyId = res.insertedId.toHexString()
      await request(app)
        .get(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
