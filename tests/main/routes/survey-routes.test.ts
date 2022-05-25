import request from 'supertest'
import { setupApp } from '../../../src/main/config/app'
import { MongoHelper } from '../../../src/infra/db/mongodb'
import { mockSurveyModel, mockSurveyParamsArray } from '../../domain/mocks'
import { Collection } from 'mongodb'
import { Express } from 'express'
import { mockAccessToken } from '../mocks'

let surveyCollection: Collection
let accountCollection: Collection
let app: Express

const makeAccessToken = async (role?: string): Promise<string> => mockAccessToken(surveyCollection, accountCollection, role)

describe('Login Routes', () => {
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

  describe('POST /surveys', () => {
    it('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send(mockSurveyModel())
        .expect(403)
    })

    it('should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken('admin')
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
      const accessToken = await makeAccessToken()
      await surveyCollection.insertMany(mockSurveyParamsArray(4))
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
