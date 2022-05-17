import { Collection } from 'mongodb'
import { SurveyModel } from '../../../../domain/models/survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongorepository } from './survey-mongo-repository'

let surveyCollection: Collection

const makeFakeSurvey = (): SurveyModel => ({
  id: 'id_',
  question: 'question',
  answers: [
    { image: 'imagea.png', answer: 'answer A' },
    { image: 'imageb.png', answer: 'answer B' },
    { image: 'imagec.png', answer: 'answer C' }
  ],
  date: new Date('2022-1-1')
})

const makeFakeSurveys = (n: number): SurveyModel[] => [...Array(n)].map(() => makeFakeSurvey())

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
      await sut.add(makeFakeSurvey())
      const survey = await surveyCollection.findOne({ question: 'question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      const sut = new SurveyMongorepository()
      await surveyCollection.insertMany(makeFakeSurveys(3))
      const surveys = await sut.loadAll()
      expect(surveys).toHaveLength(3)
      expect(surveys[0].question).toBe('question')
      expect(surveys[1].date).toEqual(new Date('2022-1-1'))
    })

    it('should load empty list', async () => {
      const sut = new SurveyMongorepository()
      const surveys = await sut.loadAll()
      expect(surveys).toHaveLength(0)
    })
  })
})
