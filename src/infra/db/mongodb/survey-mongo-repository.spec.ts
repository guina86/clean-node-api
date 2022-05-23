import { SurveyMongorepository } from './survey-mongo-repository'
import { MongoHelper } from './mongo-helper'
import { Collection } from 'mongodb'
import { mockAccountParams, mockSurveyModel, mockSurveyModelArray, mockSurveyResultObject } from '../../../domain/test'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAccountParams())
  return res.insertedId.toHexString()
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    it('should add a survey on success', async () => {
      const sut = new SurveyMongorepository()
      await sut.add(mockSurveyModel())
      const survey = await surveyCollection.findOne({ question: 'question 1' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      const sut = new SurveyMongorepository()
      const accountId = await makeAccountId()
      const result = await surveyCollection.insertMany(mockSurveyModelArray(3))
      const surveyId = result.insertedIds[0].toHexString()
      await surveyResultCollection.insertOne(mockSurveyResultObject(surveyId, accountId, 'answer A'))
      const surveys = await sut.loadAll(accountId)
      expect(surveys).toHaveLength(3)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe('question 2')
      expect(surveys[1].didAnswer).toBe(false)
      expect(surveys[2].date).toEqual(new Date('2022-1-1'))
      expect(surveys[2].didAnswer).toBe(false)
    })

    it('should load empty list', async () => {
      const sut = new SurveyMongorepository()
      const accountId = await makeAccountId()
      const surveys = await sut.loadAll(accountId)
      expect(surveys).toHaveLength(0)
    })
  })

  describe('loadById()', () => {
    it('should load a survey on success', async () => {
      const sut = new SurveyMongorepository()
      const result = await surveyCollection.insertOne(mockSurveyModel())
      const id = result.insertedId.toHexString()
      const survey = await sut.loadById(id)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
      expect(survey.id).toBe(id)
      expect(survey.question).toBe('question 1')
    })
  })
})
