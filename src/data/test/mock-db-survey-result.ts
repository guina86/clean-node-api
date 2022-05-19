import { SurveyResultModel } from '../../domain/models'
import { mockSurveyResultModel } from '../../domain/test'
import { SaveSurveyResultParams } from '../../domain/usecases'
import { SaveSurveyResultRepository } from '../protocols'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (surveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}
