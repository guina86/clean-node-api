import { SurveyResultModel } from '../../domain/models'
import { LoadSurveyResult } from '../../domain/usecases'
import { LoadSurveyResultRepository } from '../protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (private readonly loadSurveyResultRepository: LoadSurveyResultRepository) {}

  async load (surveyId: string): Promise<SurveyResultModel> {
    await this.loadSurveyResultRepository.load(surveyId)
    return null
  }
}
