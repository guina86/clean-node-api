import { SurveyResultModel } from '../../domain/models'
import { mockSurveyResultModel } from '../../domain/test'
import { SaveSurveyResult, SaveSurveyResultParams } from '../../domain/usecases'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }
  return new SaveSurveyResultStub()
}
