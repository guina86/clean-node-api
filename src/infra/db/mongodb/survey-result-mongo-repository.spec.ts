import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from './mongo-helper'
import { Collection } from 'mongodb'
import { mockAccountParams, mockSurveyParams, mockSurveyResultObject, mockSurveyResultParams } from '../../../domain/test'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAccountParams())
  return res.insertedId.toHexString()
}

const makeSurveyId = async (): Promise<string> => {
  const res = await surveyCollection.insertOne(mockSurveyParams())
  return res.insertedId.toHexString()
}

describe('SurveyResultMongoRepository', () => {
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

  describe('save()', () => {
    it('should add a surveyResult if its new', async () => {
      const sut = new SurveyResultMongoRepository()
      const surveyId = await makeSurveyId()
      const accountId = await makeAccountId()
      const surveyResultData = mockSurveyResultParams(surveyId, accountId, 'answer A')
      const surveyResult = await sut.save(surveyResultData)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toBe(surveyId)
      expect(surveyResult.answers).toHaveLength(3)
      expect(surveyResult.answers[0].answer).toBe('answer A')
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
      expect(surveyResult.date).toEqual(new Date('2022-1-1'))
    })

    it('should update a surveyResult if it already exists', async () => {
      const sut = new SurveyResultMongoRepository()
      const surveyId = await makeSurveyId()
      const accountId = await makeAccountId()
      await surveyResultCollection.insertOne(mockSurveyResultObject(surveyId, accountId, 'answer A'))
      const surveyResult = await sut.save(mockSurveyResultParams(surveyId, accountId, 'answer B'))
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toBe(surveyId)
      expect(surveyResult.answers).toHaveLength(3)
      expect(surveyResult.answers[0].count).toBe(0)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(true)
    })
  })

  describe('loadBySurveyId()', () => {
    it('should load a surveyResult', async () => {
      const sut = new SurveyResultMongoRepository()
      const surveyId = await makeSurveyId()
      const accountId = await makeAccountId()
      await surveyResultCollection.insertMany([
        mockSurveyResultObject(surveyId, accountId, 'answer A'),
        mockSurveyResultObject(surveyId, await makeAccountId(), 'answer B'),
        mockSurveyResultObject(surveyId, await makeAccountId(), 'answer B'),
        mockSurveyResultObject(surveyId, await makeAccountId(), 'answer A'),
        mockSurveyResultObject(surveyId, await makeAccountId(), 'answer A')
      ])
      const surveyResult = await sut.loadBySurveyId(surveyId, accountId)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toBe(surveyId)
      expect(surveyResult.answers).toHaveLength(3)
      expect(surveyResult.answers[0].answer).toBe('answer A')
      expect(surveyResult.answers[0].percent).toBe(60)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult.answers[1].answer).toBe('answer B')
      expect(surveyResult.answers[1].percent).toBe(40)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[2].answer).toBe('answer C')
      expect(surveyResult.answers[2].percent).toBe(0)
      expect(surveyResult.answers[2].isCurrentAccountAnswer).toBe(false)
    })

    it('should load a surveyResult if currentUser have not voted', async () => {
      const sut = new SurveyResultMongoRepository()
      const surveyId = await makeSurveyId()
      const accountId = await makeAccountId()
      await surveyResultCollection.insertMany([
        mockSurveyResultObject(surveyId, await makeAccountId(), 'answer B'),
        mockSurveyResultObject(surveyId, await makeAccountId(), 'answer A'),
        mockSurveyResultObject(surveyId, await makeAccountId(), 'answer A')
      ])
      const surveyResult = await sut.loadBySurveyId(surveyId, accountId)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toBe(surveyId)
      expect(surveyResult.answers).toHaveLength(3)
      expect(surveyResult.answers[0].answer).toBe('answer A')
      expect(surveyResult.answers[0].percent).toBe(67)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[1].answer).toBe('answer B')
      expect(surveyResult.answers[1].percent).toBe(33)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[2].answer).toBe('answer C')
      expect(surveyResult.answers[2].percent).toBe(0)
      expect(surveyResult.answers[2].isCurrentAccountAnswer).toBe(false)
    })

    it('should load a surveyResult if no votes have been casted', async () => {
      const sut = new SurveyResultMongoRepository()
      const surveyId = await makeSurveyId()
      const accountId = await makeAccountId()
      const surveyResult = await sut.loadBySurveyId(surveyId, accountId)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toBe(surveyId)
      expect(surveyResult.answers).toHaveLength(3)
      expect(surveyResult.answers[0].percent).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
    })

    it('should return null if an invalid surveyId is provided', async () => {
      const sut = new SurveyResultMongoRepository()
      const accountId = await makeAccountId()
      const surveyResult = await sut.loadBySurveyId('628acb10c22bfab572304ec8', accountId)
      expect(surveyResult).toBeNull()
    })
  })
})
