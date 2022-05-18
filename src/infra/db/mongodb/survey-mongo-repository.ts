import { MongoHelper } from './mongo-helper'
import { AddSurveyRepository, LoadSurveysRepository } from '../../../data/protocols'
import { SurveyModel } from '../../../domain/models'
import { AddSurveyModel } from '../../../domain/usecases'

export class SurveyMongorepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
    return surveys.map(survey => MongoHelper.map(survey))
  }
}
