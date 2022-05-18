import { MongoHelper } from './mongo-helper'
import { AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '../../../data/protocols'
import { SurveyModel } from '../../../domain/models'
import { AddSurveyModel } from '../../../domain/usecases'

export class SurveyMongorepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const data = { ...surveyData } // copy made to avoid side effects. insertOne mutates the original object
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(data)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
    return MongoHelper.mapArray(surveys)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: MongoHelper.to_id(id) })
    return survey && MongoHelper.map(survey)
  }
}
