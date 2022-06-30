import { MongoHelper } from '@infra/db/mongodb'
import { setupApp } from '@main/config/app'
import { mockSurveyParams } from '@tests/domain/mocks'
import { mockAccessToken } from '@tests/main/mocks'
import { Collection } from 'mongodb'
import { Express } from 'express'
import request from 'supertest'

describe('SurveyResult GraphQL', () => {
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

  describe('SurveyResult Query', () => {
    const makeQuery = (surveyId: string): string => `query {
      surveyResult(surveyId: "${surveyId}") {
        surveyId
        question
        answers {
          image
          answer
          count
          percent
          isCurrentAccountAnswer
        }
        date
      }
    }`

    it('should return 403 on load survey result without accessToken', async () => {
      const query = makeQuery('any_survey_id')
      const res = await request(app)
        .post('/graphql')
        .send({ query })

      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Access denied')
    })

    it('should return 200 with a survey result', async () => {
      const accessToken = await mockAccessToken(accountCollection)
      const surveyId = (await surveyCollection.insertOne(mockSurveyParams())).insertedId.toHexString()
      const query = makeQuery(surveyId)
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.surveyResult.question).toBe('question 1')
      expect(res.body.data.surveyResult.answers[0].count).toBe(0)
      expect(res.body.data.surveyResult.answers[0].percent).toBe(0)
      expect(res.body.data.surveyResult.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(res.body.data.surveyResult.date).toBe((new Date('2022-1-1')).toISOString())
    })
  })

  describe('SaveSurveyResult Mutation', () => {
    const makeMutation = (surveyId: string, answer: string): string => `mutation {
      saveSurveyResult(surveyId: "${surveyId}", answer: "${answer}") {
        surveyId
        question
        answers {
          image
          answer
          count
          percent
          isCurrentAccountAnswer
        }
        date
      }
    }`

    it('should return 403 on save survey result without accessToken', async () => {
      const query = makeMutation('any_survey_id', 'answer A')
      const res = await request(app)
        .post('/graphql')
        .send({ query })

      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Access denied')
    })

    it('should return 200 with a survey result', async () => {
      const accessToken = await mockAccessToken(accountCollection)
      const surveyId = (await surveyCollection.insertOne(mockSurveyParams())).insertedId.toHexString()
      const query = makeMutation(surveyId, 'answer B')
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.saveSurveyResult.question).toBe('question 1')
      expect(res.body.data.saveSurveyResult.answers[0].count).toBe(0)
      expect(res.body.data.saveSurveyResult.answers[1].count).toBe(1)
      expect(res.body.data.saveSurveyResult.answers[0].percent).toBe(0)
      expect(res.body.data.saveSurveyResult.answers[1].percent).toBe(100)
      expect(res.body.data.saveSurveyResult.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(res.body.data.saveSurveyResult.answers[1].isCurrentAccountAnswer).toBe(true)
      expect(res.body.data.saveSurveyResult.date).toBe((new Date('2022-1-1')).toISOString())
    })
  })
})
