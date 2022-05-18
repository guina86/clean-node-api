import { SaveSurveyResultRepository } from '../../../data/protocols'
import { SurveyResultModel } from '../../../domain/models'
import { SaveSurveyResultModel } from '../../../domain/usecases'
import { MongoHelper } from './mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (surveyResultData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const result = await surveyResultCollection.findOneAndUpdate({
      surveyId: surveyResultData.surveyId,
      accountId: surveyResultData.accountId
    },{
      $set: {
        answer: surveyResultData.answer,
        date: surveyResultData.date
      }
    },{
      upsert: true,
      returnDocument: 'after'
    })
    return MongoHelper.map(result.value)
  }
}
