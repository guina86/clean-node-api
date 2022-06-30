import { SurveyMongorepository, MongoHelper } from '@infra/db/mongodb'
import { mockAccountParams, mockSurveyModel, mockSurveyModelArray, mockSurveyParams, mockSurveyResultObject } from '@tests/domain/mocks'
import { Collection } from 'mongodb'

describe('SurveyMongoRepository', () => {
  const makeSut = (): SurveyMongorepository => new SurveyMongorepository()
  let surveyCollection: Collection
  let surveyResultCollection: Collection
  let accountCollection: Collection

  const makeAccountId = async (): Promise<string> => {
    const res = await accountCollection.insertOne(mockAccountParams())
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

  describe('add()', () => {
    it('should add a survey on success', async () => {
      const sut = makeSut()

      await sut.add(mockSurveyModel())

      const survey = await surveyCollection.findOne({ question: 'question 1' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      const sut = makeSut()
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
      const sut = makeSut()
      const accountId = await makeAccountId()

      const surveys = await sut.loadAll(accountId)

      expect(surveys).toHaveLength(0)
    })
  })

  describe('loadById()', () => {
    it('should load a survey on success', async () => {
      const sut = makeSut()
      const result = await surveyCollection.insertOne(mockSurveyParams())
      const id = result.insertedId.toHexString()

      const survey = await sut.loadById(id)

      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
      expect(survey.id).toBe(id)
      expect(survey.question).toBe('question 1')
    })
  })
})
