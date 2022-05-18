import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SaveSurveyResultModel } from '../../../domain/usecases'
import { MongoHelper } from './mongo-helper'
import { Collection } from 'mongodb'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeFakeSurveyResult = (surveyId: string, accountId: string): SaveSurveyResultModel => ({
  surveyId,
  accountId,
  answer: 'answer B',
  date: new Date('2022-1-1')
})

const makeAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  })
  return res.insertedId.toHexString()
}

const makeSurveyId = async (): Promise<string> => {
  const res = await surveyCollection.insertOne({
    question: 'question',
    answers: [
      { image: 'imagea.png', answer: 'answer A' },
      { image: 'imageb.png', answer: 'answer B' },
      { image: 'imagec.png', answer: 'answer C' }
    ],
    date: new Date('2022-1-1')
  })
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
      const surveyResultData = makeFakeSurveyResult(surveyId, accountId)
      const surveyResult = await sut.save(surveyResultData)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.surveyId).toBe(surveyId)
      expect(surveyResult.accountId).toBe(accountId)
      expect(surveyResult.answer).toBe('answer B')
      expect(surveyResult.date).toEqual(new Date('2022-1-1'))
    })

    it('should update a surveyResult if it already exists', async () => {
      const sut = new SurveyResultMongoRepository()
      const surveyId = await makeSurveyId()
      const accountId = await makeAccountId()
      const surveyResultData = makeFakeSurveyResult(surveyId, accountId)
      const res = await surveyResultCollection.insertOne(surveyResultData)
      surveyResultData.answer = 'answer A'
      surveyResultData.date = new Date('2022-1-2')
      const surveyResult = await sut.save(surveyResultData)
      expect(surveyResult.id).toBe(res.insertedId.toHexString())
      expect(surveyResult.answer).toBe('answer A')
      expect(surveyResult.date).toEqual(new Date('2022-1-2'))
    })
  })
})
