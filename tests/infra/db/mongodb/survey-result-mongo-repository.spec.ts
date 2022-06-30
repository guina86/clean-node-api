import { SurveyResultMongoRepository, MongoHelper } from '@infra/db/mongodb'
import { mockAccountParams, mockSurveyParams, mockSurveyResultObject, mockSurveyResultParams } from '@tests/domain/mocks'
import { Collection } from 'mongodb'

describe('SurveyResultMongoRepository', () => {
  const makeSut = (): SurveyResultMongoRepository => new SurveyResultMongoRepository()
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

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    surveyCollection = MongoHelper.getCollection('surveys')
    surveyResultCollection = MongoHelper.getCollection('surveyResults')
    accountCollection = MongoHelper.getCollection('accounts')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await surveyCollection.deleteMany({})
    await surveyResultCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    it('should add a surveyResult if its new', async () => {
      const sut = makeSut()
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
      const sut = makeSut()
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
      const sut = makeSut()
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
      const sut = makeSut()
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
      const sut = makeSut()
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
      const sut = makeSut()
      const accountId = await makeAccountId()

      const surveyResult = await sut.loadBySurveyId('628acb10c22bfab572304ec8', accountId)

      expect(surveyResult).toBeNull()
    })
  })
})
