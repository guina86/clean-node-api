import { Collection } from 'mongodb'
import { SurveyModel } from '../../../../domain/models/survey'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongorepository } from './survey-mongo-repository'

let surveyCollection: Collection

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    { image: 'any_image', answer: 'any_answer' },
    { answer: 'other_answer' }
  ],
  date: new Date('2022-1-1')
})

const makeFakeSurveys = (): SurveyModel[] => [...Array(3)].map((_, i) => ({
  id: `id_${i}`,
  question: `question ${i}`,
  answers: [
    { image: `image${i}a.png`, answer: `answer ${i} A` },
    { image: `image${i}b.png`, answer: `answer ${i} B` },
    { image: `image${i}c.png`, answer: `answer ${i} C` }
  ],
  date: new Date('2022-1-1')
}))

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
  })

  describe('add()', () => {
    it('should add a survey on success', async () => {
      const sut = new SurveyMongorepository()
      await sut.add(makeFakeSurveyData())
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      const sut = new SurveyMongorepository()
      await surveyCollection.insertMany(makeFakeSurveys())
      const surveys = await sut.loadAll()
      expect(surveys).toHaveLength(3)
      expect(surveys[0].question).toBe('question 0')
      expect(surveys[1].date).toEqual(new Date('2022-1-1'))
    })

    it('should load empty list', async () => {
      const sut = new SurveyMongorepository()
      const surveys = await sut.loadAll()
      expect(surveys).toHaveLength(0)
    })
  })
})
