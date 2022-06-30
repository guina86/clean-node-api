import { setupApp } from '@main/config/app'
import { MongoHelper } from '@infra/db/mongodb'
import { mockSurveyParams } from '@tests/domain/mocks'
import { mockAccessToken } from '@tests/main/mocks'
import { Collection } from 'mongodb'
import { Express } from 'express'
import request from 'supertest'

describe('Survey Result Routes', () => {
  let surveyCollection: Collection
  let accountCollection: Collection
  let app: Express

  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
    surveyCollection = MongoHelper.getCollection('surveys')
    accountCollection = MongoHelper.getCollection('accounts')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await surveyCollection.deleteMany({})
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
      const accessToken = await mockAccessToken(accountCollection)
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
      const accessToken = await mockAccessToken(accountCollection)
      const res = await surveyCollection.insertOne(mockSurveyParams())
      const surveyId = res.insertedId.toHexString()
      await request(app)
        .get(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
