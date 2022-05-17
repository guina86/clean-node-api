import { AddSurveyRepository } from '../../../data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '../../../data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '../../../domain/models/survey'
import { AddSurveyModel } from '../../../domain/usecases/add-survey'
import { MongoHelper } from './mongo-helper'

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