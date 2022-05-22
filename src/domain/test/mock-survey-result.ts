import { MongoHelper } from '../../infra/db/mongodb'
import { SurveyResultModel } from '../models'
import { SaveSurveyResultParams } from '../usecases'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: '',
  answers: [
    {
      image: 'imagea.png',
      answer: 'answer A',
      count: 7,
      percent: 70
    },
    {
      image: 'imageb.png',
      answer: 'answer B',
      count: 2,
      percent: 20
    },
    {
      image: 'imagec.png',
      answer: 'answer C',
      count: 1,
      percent: 10
    }
  ],
  date: new Date('2022-1-1')
})

export const mockSurveyResultParams = (surveyId: string = 'any_survey_id', accountId: string = 'any_account_id', answer: string = 'answer A'): SaveSurveyResultParams => ({
  surveyId,
  accountId,
  answer,
  date: new Date('2022-1-1')
})

export const mockSurveyResultObject = (surveyId: string = 'any_survey_id', accountId: string = 'any_account_id', answer: string = 'answer A'): any => ({
  surveyId: MongoHelper.to_id(surveyId),
  accountId: MongoHelper.to_id(accountId),
  answer,
  date: new Date('2022-1-1')
})
