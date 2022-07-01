import { SaveSurveyResultRepository } from '@data/protocols'
import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResult, SaveSurveyResultParams } from '@domain/usecases'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResult = await this.saveSurveyResultRepository.save(data)
    return surveyResult
  }
}
