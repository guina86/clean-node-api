import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongorepository } from './survey-mongo-repository'

let surveyCollection: Collection

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    { image: 'any_image', answer: 'any_answer' },
    { answer: 'other_answer' }
  ]
})

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

  it('should add as survey on success', async () => {
    const sut = new SurveyMongorepository()
    await sut.add(makeFakeSurveyData())
    const survey = await surveyCollection.findOne({ question: 'any_question' })
    expect(survey).toBeTruthy()
  })
})
