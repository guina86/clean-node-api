import { SurveyResultModel } from '../models'
import { SaveSurveyResultParams } from '../usecases'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date('2022-1-1')
})

export const mockSurveyResultParams = (surveyId: string = 'any_survey_id', accountId: string = 'any_account_id'): SaveSurveyResultParams => ({
  surveyId,
  accountId,
  answer: 'answer A',
  date: new Date('2022-1-1')
})
