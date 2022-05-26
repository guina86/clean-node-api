import request from 'supertest'
import { setupApp } from '../../../src/main/config/app'
import { MongoHelper } from '../../../src/infra/db/mongodb'
import { mockSurveyParamsArray } from '../../domain/mocks'
import { Collection } from 'mongodb'
import { Express } from 'express'
import { mockAccessToken } from '../mocks/mockAccessToken'

let surveyCollection: Collection
let accountCollection: Collection
let app: Express

const makeAccessToken = async (role?: string): Promise<string> => mockAccessToken(accountCollection, role)

describe('Survey GraphQL', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Surveys query', () => {
    const query = `query {
      surveys {
        id
        question
        answers {
          image
          answer
        }
        date
        didAnswer
      }
    }`

    it('should return 403 on load survey without accessToken', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Access denied')
    })

    it('should return 200 with an array of surveys', async () => {
      const accessToken = await makeAccessToken()
      await surveyCollection.insertMany(mockSurveyParamsArray(4))
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.surveys).toHaveLength(4)
      expect(res.body.data.surveys[0].id).toBeTruthy()
      expect(res.body.data.surveys[0].question).toBe('question 1')
      expect(res.body.data.surveys[1].answers).toHaveLength(3)
      expect(res.body.data.surveys[2].date).toBe((new Date('2022-1-1')).toISOString())
      expect(res.body.data.surveys[3].didAnswer).toBe(false)
    })
  })
})
