import { SurveyResultModel } from '../../domain/models'
import { SaveSurveyResult, SaveSurveyResultModel } from '../../domain/usecases'
import { SaveSurveyResultRepository } from '../protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResult = await this.saveSurveyResultRepository.save(data)
    return surveyResult
  }
}
