import { MongoHelper } from './mongo-helper'
import { QueryBuilder } from './query-builder'
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '../../../data/protocols'
import { SurveyResultModel } from '../../../domain/models'
import { SaveSurveyResultParams } from '../../../domain/usecases'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository, LoadSurveyResultRepository {
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const { surveyId, accountId } = data
    await surveyResultCollection.findOneAndUpdate({
      surveyId: MongoHelper.to_id(surveyId),
      accountId: MongoHelper.to_id(accountId)
    },{
      $set: {
        answer: data.answer,
        date: data.date
      }
    },{
      upsert: true
    })
    const surveyResult = await this.loadBySurveyId(surveyId, accountId)
    return surveyResult
  }

  async loadBySurveyId (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const query = new QueryBuilder()
      .match({ _id: MongoHelper.to_id(surveyId) })
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'votes'
      })
      .addFields({
        accountAnswer: { $arrayElemAt: [{ $filter: { input: '$votes', cond: { $eq: ['$$this.accountId', MongoHelper.to_id(accountId)] } } }, 0] },
        totalAnswers: { $size: '$votes' }
      })
      .project({
        _id: 0,
        surveyId: '$_id',
        question: '$question',
        answers: {
          $map: {
            input: '$answers',
            as: 'item',
            in: {
              $let: {
                vars: {
                  count: { $size: { $filter: { input: '$votes', cond: { $eq: ['$$this.answer', '$$item.answer'] } } } }
                },
                in: {
                  image: '$$item.image',
                  answer: '$$item.answer',
                  count: '$$count',
                  percent: { $round: { $cond: [{ $ne: ['$totalAnswers', 0] }, { $multiply: [{ $divide: ['$$count', '$totalAnswers'] }, 100] } , 0] } },
                  isCurrentAccountAnswer: { $eq: ['$$item.answer', '$accountAnswer.answer'] }
                }
              }
            }
          }
        },
        date: '$date'
      })
      .build()

    const surveyResult = await surveysCollection.aggregate(query).toArray()
    if (!surveyResult.length) return null
    const result = surveyResult[0]
    result.surveyId = surveyId
    return result as SurveyResultModel
  }
}
