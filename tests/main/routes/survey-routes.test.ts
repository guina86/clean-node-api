import { setupApp } from '@main/config/app'
import { MongoHelper } from '@infra/db/mongodb'
import { mockSurveyModel, mockSurveyParamsArray } from '@tests/domain/mocks'
import { Collection } from 'mongodb'
import { Express } from 'express'
import { mockAccessToken } from '@tests/main/mocks'
import request from 'supertest'

describe('Login Routes', () => {
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

  describe('POST /surveys', () => {
    it('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send(mockSurveyModel())
        .expect(403)
    })

    it('should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await mockAccessToken(accountCollection, 'admin')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(mockSurveyModel())
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    it('should return 403 on load survey without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    it('should return 200 on load survey with valid accessToken', async () => {
      const accessToken = await mockAccessToken(accountCollection)
      await surveyCollection.insertMany(mockSurveyParamsArray(4))
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
