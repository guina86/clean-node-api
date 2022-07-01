import { LoadSurveyResultRepository } from '@data/protocols'
import { SurveyResultModel } from '@domain/models'
import { LoadSurveyResult } from '@domain/usecases'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (private readonly loadSurveyResultRepository: LoadSurveyResultRepository) {}

  async load (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId, accountId)
    return surveyResult
  }
}
