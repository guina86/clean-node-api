import { MongoHelper } from '@infra/db/mongodb'
import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResultParams } from '@domain/usecases'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: '',
  answers: [
    {
      image: 'imagea.png',
      answer: 'answer A',
      count: 7,
      percent: 70,
      isCurrentAccountAnswer: false
    },
    {
      image: 'imageb.png',
      answer: 'answer B',
      count: 2,
      percent: 20,
      isCurrentAccountAnswer: false
    },
    {
      image: 'imagec.png',
      answer: 'answer C',
      count: 1,
      percent: 10,
      isCurrentAccountAnswer: false
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

export const mockSurveyResultObject = (surveyId: string, accountId: string, answer: string): any => ({
  surveyId: MongoHelper.to_id(surveyId),
  accountId: MongoHelper.to_id(accountId),
  answer,
  date: new Date('2022-1-1')
})
